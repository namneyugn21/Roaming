const admin = require('firebase-admin');
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

// register a new user
exports.register = async (req, res) => {
  try {
    const { 
      uid,
      email,
      password,
      name,
      username,
      bio
    } = req.body;

    if (!email || !password || !name || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // create a new document in users collection
    const userData = {
      uid: uid,
      email,
      name,
      username,
      bio,
      avatar: 'https://prcdn.freetls.fastly.net/release_image/88144/38/88144-38-c473d1e627ab9b413695f6d2f46279a3-425x427.png?format=jpeg&auto=webp&fit=bounds&width=720&height=480', // default profile image
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('users').doc(userData.uid).set(userData);

    res.status(201).json({ message: "User registered", userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// get the current signed in user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // get user from request object middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // get user data from firestore
    const userData = await db.collection('users').doc(user.uid).get();

    if (!userData.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(userData.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// update the current signed in user
exports.updateCurrentUser = async (req, res) => {
  try {
    const user = req.user; // get user from request object middleware
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // get user data from request body
    const { 
      username,
      name,
      bio
    } = req.body;

    if (!name || !username) {
      return res.status(400).json({ error: 'Name and username are required' });
    }

    // update user data in firestore
    const userData = {
      name,
      username,
      bio,
    };
    await db.collection('users').doc(user.uid).update(userData);

    res.status(200).json({ message: "User updated", userData });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

// get the user posts
exports.getCurrentUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const postsSnapshot = await db
      .collection('posts')
      .where('uid', '==', userId)
      .orderBy("createdAt", "desc")
      .get();

    if (postsSnapshot.empty) {
      return res.status(200).json({ posts: [] });
    }

    const posts = postsSnapshot.docs.map(doc => ({
      pid: doc.id, // get the post id
      ...doc.data() // get all the fields from the document
    }));
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
}