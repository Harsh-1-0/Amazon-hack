import asyncio
import os
from dotenv import load_dotenv
from hume.client import AsyncHumeClient
from hume.empathic_voice.chat.socket_client import ChatConnectOptions
from hume.empathic_voice.chat.types import SubscribeEvent
from hume import MicrophoneInterface, Stream

load_dotenv()
HUME_API_KEY = os.getenv("HUME_API_KEY")
HUME_SECRET_KEY = os.getenv("HUME_SECRET_KEY")
HUME_CONFIG_ID = os.getenv("HUME_CONFIG_ID")

class MoodDetector:
    def __init__(self):
        self.byte_strs = Stream.new()
        self.detected_mood = None
        self._done_event = asyncio.Event()

    async def on_open(self):
        print("WebSocket connection opened. Start speaking...")

    async def on_message(self, message: SubscribeEvent):
        if message.type == "user_message" and message.models.prosody and not self.detected_mood:
            scores = dict(message.models.prosody.scores)
            sorted_emotions = sorted(scores.items(), key=lambda item: item[1], reverse=True)
            self.detected_mood = sorted_emotions[0][0]

            print(f"\nDetected mood: {self.detected_mood}\n")
            print("Top Emotions:")
            for emotion, score in sorted_emotions[:5]:
                print(f"  {emotion}: {score:.2f}")
            print("-" * 40)

            self._done_event.set()  

    async def on_close(self):
        print("WebSocket connection closed.")

    async def on_error(self, error):
        print(f"Socket Error: {error}")

    async def get_mood_from_voice(self, timeout=15) -> str:
        client = AsyncHumeClient(api_key=HUME_API_KEY)
        options = ChatConnectOptions(secret_key=HUME_SECRET_KEY, config_id=HUME_CONFIG_ID)

        async with client.empathic_voice.chat.connect_with_callbacks(
            options=options,
            on_open=self.on_open,
            on_message=self.on_message,
            on_close=self.on_close,
            on_error=self.on_error
        ) as socket:
            mic_task = asyncio.create_task(
                MicrophoneInterface.start(
                    socket,
                    allow_user_interrupt=True,
                    byte_stream=self.byte_strs
                )
            )

            done_task = asyncio.create_task(self._done_event.wait())

            # Wait for either mood detected or timeout
            done, pending = await asyncio.wait(
                [mic_task, done_task],
                return_when=asyncio.FIRST_COMPLETED,
                timeout=timeout
            )

            for task in pending:
                task.cancel()

        return self.detected_mood or "neutral"
