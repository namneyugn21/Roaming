const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const db = getFirestore();
const cloudinary = require("../config/cloudinary");

exports.getAllPosts = async (req, res) => {
  try {
    // fetch all posts from firestore
    const postsSnapshot = await db
      .collection('posts') 
      .orderBy('createdAt', 'desc') // order by newest posts first
      .get();

    if (postsSnapshot.empty) {
      return res.status(200).json({ posts: [] }); // return empty array if no posts
    }

    const posts = postsSnapshot.docs.map(doc => ({
      pid: doc.id, // get the post id
      ...doc.data() // get all the fields from the document
    }));    
    
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all posts' });
  }
}

exports.createPost = async (req, res) => {
  try {
    const { uid, image, description, latitude, longitude, username, avatar } = req.body;

    if (!uid || !username || !avatar || !image.length) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPost = {
      uid,
      image,
      description,
      latitude,
      longitude,
      username,
      avatar,
      createdAt: FieldValue.serverTimestamp(),
    };

    const postRef = await db.collection("posts").add(newPost);

    res.status(201).json({ message: "Post created, uploading images...", pid: postRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
}

exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).json({ error: "Image ID is required" });
    }

    // delete image from cloudinary
    await cloudinary.uploader.destroy(imageId);

    res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}

