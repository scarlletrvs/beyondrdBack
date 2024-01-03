const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;
const firestore = require('./firebase');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/posts', async (req, res) => {
    try {
        const postsSnapshot = await firestore.collection("Posts").get();

        if (postsSnapshot.empty) {
            return res.status(404).json({
                message: "No posts found."
            });
        }

        const allPosts = [];
        postsSnapshot.forEach(post => {
            allPosts.push(post.data());
        });

        res.json(allPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
});


app.get('/users', async (req, res)=>{
    try {
        const Users = await firestore.collection("users").get()
    const AllUsers = [
    ]
    Users.forEach(user =>  {
        AllUsers.push(user.data())
    });
 
    return res.json(AllUsers)
        
    } catch (error) {
        console.log("erro")
    }
    
})

app.post('/post', async (req, res) => {
    const post = req.body;

    try {
        if (!post || Object.keys(post).length === 0) {
            return res.status(400).json({
                message: "Invalid post data. Please provide valid data."
            });
        }

        await firestore.collection("Posts").doc(post.id).create(post);

        res.status(201).json({
            message: "Post created successfully."
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
});


app.get('/users', async (req, res) => {
    try {
        const usersSnapshot = await firestore.collection("users").get();

        if (usersSnapshot.empty) {
            return res.status(404).json({
                message: "No users found."
            });
        }

        const allUsers = [];
        usersSnapshot.forEach(user => {
            allUsers.push(user.data());
        });

        res.json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
});


app.delete('/postDelete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const postRef = firestore.collection("Posts").doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return res.status(404).json({
                message: "Post not found."
            });
        }

        await postRef.delete();

        res.status(200).json({
            message: "Post deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
});


app.put('/postEdit/:id', async (req, res) => {
    const id = req.params.id;
    const { image, text } = req.body;

    try {
        if (!text && !image) {
            return res.status(400).json({
                message: "Please provide either text or image for editing."
            });
        }

        const postRef = firestore.collection("Posts").doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return res.status(404).json({
                message: "Post not found."
            });
        }

        if (text && !image) {
            await postRef.update({ text });
        } else if (!text && image) {
            await postRef.update({ image });
        } else {
            await postRef.update({ text, image });
        }

        res.status(200).json({
            message: "Post edited successfully."
        });
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
});




app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});
