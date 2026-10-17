const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log("Username: ", process.env.DB_USER);

//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jip67yo.mongodb.net/?appName=Cluster0`;

//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jip67yo.mongodb.net/?appName=Cluster0`;

const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASS);

const uri = `mongodb://${username}:${password}@ac-25bopin-shard-00-00.jip67yo.mongodb.net:27017,ac-25bopin-shard-00-01.jip67yo.mongodb.net:27017,ac-25bopin-shard-00-02.jip67yo.mongodb.net:27017/?ssl=true&replicaSet=atlas-98de78-shard-0&authSource=admin`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const usersCollection = client.db('Shopery').collection('users');
    const categoriesCollection = client.db('Shopery').collection('categories');
    const productsCollection = client.db('Shopery').collection('products');
    const hotdealsCollection = client.db('Shopery').collection('hotdeals');
    const cartsCollection = client.db('Shopery').collection('carts');
    const wishListCollection = client.db('Shopery').collection('wishlist');
    const blogsCollection = client.db('Shopery').collection('blogs');
    const commentsCollection = client.db('Shopery').collection('comments');
    const reviewsCollection = client.db('Shopery').collection('reviews');
    const ordersCollection = client.db('Shopery').collection('orders');
    const billingsCollection = client.db('Shopery').collection('billings');

    // JWT related API
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.send({ token });
    });

    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'Unauthorized access' });
        }
        req.decoded = decoded;
        next();
      });
    };

    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === 'admin';
      if (!isAdmin) {
        return res.status(403).send({ message: 'Forbidden access' });
      }
      next();
    };

    // Function to update user in the database
    const updateUserInDatabase = async (userInfo) => {
      const { displayName, photoURL, phone, email } = userInfo;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          displayName: displayName,
          photoURL: photoURL,
          phone: phone,
        }
      };
      await usersCollection.updateOne(filter, updateDoc);
    };

    // Users related API
    app.post("/users", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already Exists", insertedId: null });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);

      console.log(user);
    });

    app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.patch('/users', async (req, res) => {
      const { displayName, photoURL, phone, email } = req.body;
      try {
        await updateUserInDatabase({ displayName, photoURL, phone, email });
        res.status(200).send({ message: 'Profile updated successfully' });
      } catch (error) {
        console.error("Error updating user in database:", error);
        res.status(500).send({ message: 'Error updating profile' });
      }
    });

    app.get('/users/admin/:email', verifyToken, async (req, res) => {
      const email = req.params.email;

      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "Forbidden access" });
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);

      let admin = false;
      if (user) {
        admin = user?.role === 'admin';
      }
      res.send({ admin });
    });

    app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/categories', async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });

    app.post('/products', verifyToken, verifyAdmin, async (req, res) => {
      const item = req.body;
      const result = await productsCollection.insertOne(item);
      res.send(result);
    });

    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    app.patch('/products/:id', async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          name: item.name,
          category: item.category,
          price: item.price,
          sale: item.sale,
          rating: item.rating,
          availability: item.availability,
          description: item.description,
          images: item.images
        }
      };

      const result = await productsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete('/products/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // Reviews related API
    app.post("/products/:id/reviews", async (req, res) => {
      const reviewId = req.params.id;
      const review = req.body;
      review.reviewId = new ObjectId(reviewId);
      review.createdAt = new Date();
      
      const result = await reviewsCollection.insertOne(review);
      const insertedReview = await reviewsCollection.findOne({ _id: result.insertedId });

      res.status(201).json(insertedReview);
    });

    app.get("/products/:id/reviews", async (req, res) => {
      const reviewId = req.params.id;
      const query = { reviewId: new ObjectId(reviewId) };
      const reviews = await reviewsCollection.find(query).toArray();
      res.send(reviews);
    });

    app.get('/blogs', async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });

    // Comments related API
    app.post("/blogs/:id/comments", async (req, res) => {
      const blogId = req.params.id;
      const comment = req.body;
      comment.blogId = new ObjectId(blogId);
      comment.createdAt = new Date();
      
      const result = await commentsCollection.insertOne(comment);
      const insertedComment = await commentsCollection.findOne({ _id: result.insertedId });

      res.status(201).json(insertedComment);
    });

    app.get("/blogs/:id/comments", async (req, res) => {
      const blogId = req.params.id;
      const query = { blogId: new ObjectId(blogId) };
      const comments = await commentsCollection.find(query).toArray();
      res.send(comments);
    });

    // Cart APIs
    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartsCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });

    app.delete('/carts', async (req, res) => {
    try {
        const email = req.query.email;

        if (!email) {
            return res.status(400).send({
                message: "Email is required"
            });
        }

        const result = await cartsCollection.deleteMany({
            email: email
        });

        res.send(result);

    } catch (error) {
        console.error("Error clearing cart:", error);

        res.status(500).send({
            message: "Failed to clear cart"
        });
    }
});

    // Wishlist APIs
    app.post('/wishlist', async (req, res) => {
      const item = req.body;
      const result = await wishListCollection.insertOne(item);
      res.send(result);
    });

    app.get('/wishlist', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await wishListCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishListCollection.deleteOne(query);
      res.send(result);
    });

    // Orders related API
    app.post('/orders', verifyToken, async (req, res) => {
    try {
        // Get order data from Checkout page
        const order = req.body;

        // Get authenticated user's email from JWT
        const userEmail = req.decoded.email;

        // Check if order email matches logged-in user
        if (!userEmail || order.email !== userEmail) {
            return res.status(403).send({
                message: "Forbidden access! Email does not match."
            });
        }

        // Prepare order data
        const newOrder = {
            ...order,
            email: userEmail,
            createdAt: new Date(),
            status: "pending"
        };

        // Save order to MongoDB
        const result = await ordersCollection.insertOne(newOrder);

        // Send success response
        res.status(201).send(result);

      }catch (error) {
          console.error("Order creation failed:", error);

          res.status(500).send({
              message: "Failed to place order"
          });
      }
    });

    // Get order history of logged-in user
    app.get('/orders', verifyToken, async (req, res) => {
        try {
            // Get email from query parameter
            const email = req.query.email;

            // Verify logged-in user's email
            if (!email || req.decoded.email !== email) {
                return res.status(403).send({
                    message: "Forbidden access"
                });
            }

            // Find orders belonging to this user
            const query = {
                email: email
            };

            // Fetch orders (newest first)
            const result = await ordersCollection
                .find(query)
                .sort({ createdAt: -1, _id: -1 })
                .toArray();

            // Send orders to frontend
            res.status(200).send(result);

        } catch (error) {
            console.error("Failed to fetch orders:", error);

            res.status(500).send({
                message: "Failed to fetch orders"
            });
        }
    });

    app.patch('/orders/:id/cancel', verifyToken, async (req, res) => {

    try {

        const id = req.params.id;

        const userEmail = req.decoded.email;

        if (!ObjectId.isValid(id)) {

            return res.status(400).send({
                message: "Invalid order ID"
            });

        }

        const query = {
            _id: new ObjectId(id),
            email: userEmail,
            status: "pending"
        };

        const updateDoc = {
            $set: {
                status: "cancelled",
                cancelledAt: new Date()
            }
        };

        const result = await ordersCollection.updateOne(
            query,
            updateDoc
        );

        if (result.modifiedCount === 0) {

            return res.status(404).send({
                message: "Order not found or cannot be cancelled"
            });

        }

        res.status(200).send({
            message: "Order cancelled successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {

        console.error("Order cancellation failed:", error);

        res.status(500).send({
            message: "Failed to cancel order"
        });

    }

    });

    // Get all customer orders for Admin Dashboard
    app.get('/allorders', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await ordersCollection
          .find()
          .sort({ createdAt: -1, _id: -1 })
          .toArray();

        res.status(200).send(result);
      } catch (error) {
        console.error('Failed to fetch all orders:', error);

        res.status(500).send({
          message: 'Failed to fetch orders'
        });
      }
    });

          // Admin Dashboard Statistics API
      app.get('/admin/dashboard/stats', verifyToken, verifyAdmin, async (req, res) => {
        try {
          // Total number of orders
          const totalOrders = await ordersCollection.countDocuments();

          // Total number of products
          const totalProducts = await productsCollection.countDocuments();

          // Total number of registered users
          const totalCustomers = await usersCollection.countDocuments({
            role: { $ne: "admin" }
          });

          // Count orders by status
          const pendingOrders = await ordersCollection.countDocuments({
            status: "pending"
          });

          const deliveredOrders = await ordersCollection.countDocuments({
            status: "delivered"
          });

          const cancelledOrders = await ordersCollection.countDocuments({
            status: "cancelled"
          });

          // Send statistics to frontend
          res.status(200).send({
            totalOrders,
            totalProducts,
            totalCustomers,
            pendingOrders,
            deliveredOrders,
            cancelledOrders
          });

        } catch (error) {
          console.error("Failed to fetch dashboard statistics:", error);

          res.status(500).send({
            message: "Failed to fetch dashboard statistics"
          });
        }
      });

    // Billing related API
    app.post('/billing', async (req, res) => {
      const bill = req.body;
      const result = await billingsCollection.insertOne(bill);
      res.send(result);
    });

    app.get('/billing', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await billingsCollection.find(query).toArray();
      res.send(result);
    });

    // HotDeals APIs
    app.post('/hotdeals', verifyToken, verifyAdmin, async (req, res) => {
      const item = req.body;
      const result = await hotdealsCollection.insertOne(item);
      res.send(result);
    });

    app.get('/hotdeals', async (req, res) => {
      const result = await hotdealsCollection.find().toArray();
      res.send(result);
    });

    app.patch('/hotdeals/:id', async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: item.title,
          subTitle: item.subTitle,
          price: item.price,
          rating: item.rating,
          details: item.details,
          image: item.image
        }
      };

      const result = await hotdealsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete('/hotdeals/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await hotdealsCollection.deleteOne(query);
      res.send(result);
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get("/", (req, res) => {
      res.send("Shopery Server is Running");
    });

    app.listen(port, () => {
      console.log(`Shopery is running on port ${port}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
