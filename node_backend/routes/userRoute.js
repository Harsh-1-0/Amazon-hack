import express from 'express';
import userModel from '../models/user.js';
import verifyToken from '../middleware/googleVerify.js';
import verifyJwt from '../middleware/jwt.js';
import jsonwebtoken from 'jsonwebtoken';

const router = express.Router();

/**
 * @swagger
 * /:
 *   post:
 *     summary: Login or Register a user via Google token
 *     tags: [Authentication]
 *     security: []
 *     responses:
 *       200:
 *         description: Successfully logged in or registered the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */
router.post('/', verifyToken, async (req, res) => {
    const { uid, email, name, picture } = req.user;
    try {
        let user = await userModel.findOne({ user_id: uid });
        let message = "";
        if (user) {
            message = "Not a new user";
        } else {
            user = await userModel.create({
                name,
                user_id: uid,
                email,
                picture,
            });
            message = "New user created";
        }

        const token = jsonwebtoken.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: "2d"
        });

        res.status(200).json({ message, token });
    } catch (error) {
        console.error("Error during user sign-in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /updateDetails_newUser:
 *   post:
 *     summary: Update preferences for a newly registered user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               character_names:
 *                 type: array
 *                 items:
 *                   type: string
 *               archetypes:
 *                 type: array
 *                 items:
 *                   type: string
 *               media_sources:
 *                 type: array
 *                 items:
 *                   type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully updated user preferences.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/updateDetails_newUser', verifyJwt, async (req, res) => {
    const { user_id } = req.user;
    try {
        const { character_names, archetypes, media_sources, genres } = req.body;

        const user = await userModel.findOneAndUpdate(
            { user_id },
            { $set: { favCharacters: character_names, archetypes, media_sources, genres } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        console.log("Error during user details update:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/updateDetails', verifyJwt, async (req, res) => {
    const { user_id } = req.user;
    try {
        const { character_names, archetypes, media_sources, genres } = req.body;

        const user = await userModel.findOneAndUpdate(
            { user_id },
            {
                $push: {
                    favCharacters: { $each: character_names },
                    archetypes: { $each: archetypes },
                    media_sources: { $each: media_sources },
                    genres: { $each: genres }
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        console.log("Error during user details update:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/search', verifyJwt, async (req, res) => {
    const { username } = req.query;
    try {
        if (!username) {
            return res.status(400).json({ message: "Username query parameter is required" });
        }
        const user = await userModel.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error during user search:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/',verifyJwt, async (req, res) => {
    const { user_id } = req.user;
    console.log(user_id);
    try {
        const user = await userModel.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
);

export default router;
