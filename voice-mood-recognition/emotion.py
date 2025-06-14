

import asyncio
import os
from dotenv import load_dotenv
from hume.client import AsyncHumeClient
from hume.empathic_voice.chat.socket_client import ChatConnectOptions
from hume.empathic_voice.chat.types import SubscribeEvent
from hume import MicrophoneInterface, Stream

class WebSocketHandler:
    def __init__(self):
        self.byte_strs = Stream.new()

    async def on_open(self):
        print("WebSocket connection opened. Start speaking...")

    async def on_message(self, message: SubscribeEvent):
        # Only process user messages, ignore assistant messages
        if message.type == "user_message":
            print(f"User: {message.message.content}")
            if message.models.prosody is not None:
                scores = dict(message.models.prosody.scores)
                sorted_emotions = sorted(scores.items(), key=lambda item: item[1], reverse=True)
                print("User emotions detected:")
                for emotion, score in sorted_emotions[:5]:
                    print(f"  {emotion}: {score:.2f}")
                print("-" * 40)
            else:
                print("Emotion scores not available.")
        elif message.type == "error":
            print(f"Error: {message.message}")

    async def on_close(self):
        print("WebSocket connection closed.")

    async def on_error(self, error):
        print(f"Error: {error}")

async def main():
    load_dotenv()
    HUME_API_KEY = os.getenv("HUME_API_KEY")
    HUME_SECRET_KEY = os.getenv("HUME_SECRET_KEY")
    HUME_CONFIG_ID = os.getenv("HUME_CONFIG_ID")  # Optional, can be None

    client = AsyncHumeClient(api_key=HUME_API_KEY)
    options = ChatConnectOptions(
        config_id=HUME_CONFIG_ID, 
        secret_key=HUME_SECRET_KEY
    )
    websocket_handler = WebSocketHandler()

    async with client.empathic_voice.chat.connect_with_callbacks(
        options=options,
        on_open=websocket_handler.on_open,
        on_message=websocket_handler.on_message,
        on_close=websocket_handler.on_close,
        on_error=websocket_handler.on_error
    ) as socket:
        await asyncio.create_task(
            MicrophoneInterface.start(
                socket,
                allow_user_interrupt=True,
                byte_stream=websocket_handler.byte_strs
            )
        )

if __name__ == "__main__":
    asyncio.run(main())