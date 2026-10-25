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

// async function run() {
//   try {
//     await client.connect();

client.connect(() =>{
    console.log("Connecting to MongoDB")
}).catch(console.dir)

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


    // Restore product stock when an order is cancelled.
// This function must be called inside a MongoDB transaction.
    async function restoreOrderStock(order, session) {
        // Old orders that did not deduct stock must not restore stock.
        if (order.stockDeducted !== true || order.stockRestored === true) {
            return;
        }

        if (!Array.isArray(order.cart)) {
            throw new Error('Invalid order cart; stock restoration aborted.');
        }

        for (const item of order.cart) {
            const productId = String(item.productId || '');
            const quantity = Number(item.quantity);

            if (
                !ObjectId.isValid(productId) ||
                !Number.isSafeInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error('Invalid order item; stock restoration aborted.');
            }

            const filter = {
                _id: new ObjectId(productId)
            };

            const product = await productsCollection.findOne(
                filter,
                { session }
            );

            // Do not silently lose stock if a product was deleted.
            if (!product) {
                throw new Error(
                    `Product ${productId} was not found. Stock restoration aborted.`
                );
            }

            // New stock-managed products must have a valid stock quantity.
            if (
                !Number.isSafeInteger(product.stockQuantity) ||
                product.stockQuantity < 0
            ) {
                throw new Error(
                    `Product "${product.name}" has invalid stock data.`
                );
            }

            const newStock = product.stockQuantity + quantity;

            await productsCollection.updateOne(
                filter,
                {
                    $set: {
                        stockQuantity: newStock,
                        availability: newStock > 0
                            ? 'In Stock'
                            : 'Out of Stock',
                        updatedAt: new Date()
                    }
                },
                { session }
            );
        }
    }



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

    app.post('/categories', verifyToken, verifyAdmin, async (req, res) => {
    const category = req.body;

    const existingCategory = await categoriesCollection.findOne({
        name: { $regex: `^${category.name.trim()}$`, $options: 'i' }
    });

    if (existingCategory) {
        return res.status(409).send({ message: 'Category already exists' });
    }

    const result = await categoriesCollection.insertOne({
        name: category.name.trim(),
        image: category.image || ''
    });

    res.send(result);
    });

    app.get('/categories', async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });

    app.patch('/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const category = req.body;

      if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid category ID' });
      }

      const result = await categoriesCollection.updateOne(
          { _id: new ObjectId(id) },
          {
              $set: {
                  name: category.name.trim(),
                  image: category.image || ''
              }
          }
      );

      res.send(result);
    });

    app.delete('/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid category ID' });
        }

        const result = await categoriesCollection.deleteOne({
            _id: new ObjectId(id)
        });

        res.send(result);
    });

    // Add a new product
    app.post('/products', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const item = req.body;

            if (!item || typeof item !== 'object') {
                return res.status(400).send({
                    message: 'Invalid product data'
                });
            }

            const name = String(item.name || '').trim();
            const category = String(item.category || '').trim();
            const price = Number(item.price);
            const rating = Number(item.rating);

            if (!name || !category) {
                return res.status(400).send({
                    message: 'Product name and category are required'
                });
            }

            if (!Number.isFinite(price) || price < 0) {
                return res.status(400).send({
                    message: 'Please provide a valid product price'
                });
            }

            if (
                item.rating !== undefined &&
                (!Number.isFinite(rating) || rating < 0 || rating > 5)
            ) {
                return res.status(400).send({
                    message: 'Rating must be between 0 and 5'
                });
            }

            const product = {
                name,
                category,
                price,
                sale: item.sale ?? '',
                rating: item.rating === '' || item.rating == null
                    ? 0
                    : rating,
                description: String(item.description || ''),
                images: Array.isArray(item.images)
                    ? item.images.filter(image => typeof image === 'string' && image.trim())
                    : [],
                availability: item.availability === 'Out of Stock'
                    ? 'Out of Stock'
                    : 'In Stock',
                createdAt: new Date()
            };

            // Stock fields are optional for backward compatibility.
            // The updated frontend will send these fields.
            if (
                item.stockQuantity !== undefined &&
                item.stockQuantity !== null &&
                item.stockQuantity !== ''
            ) {
                const stockQuantity = Number(item.stockQuantity);

                if (
                    !Number.isSafeInteger(stockQuantity) ||
                    stockQuantity < 0
                ) {
                    return res.status(400).send({
                        message: 'Stock quantity must be a non-negative integer'
                    });
                }

                const lowStockThreshold =
                    item.lowStockThreshold === undefined ||
                    item.lowStockThreshold === ''
                        ? 10
                        : Number(item.lowStockThreshold);

                if (
                    !Number.isSafeInteger(lowStockThreshold) ||
                    lowStockThreshold < 0
                ) {
                    return res.status(400).send({
                        message: 'Low stock threshold must be a non-negative integer'
                    });
                }

                product.stockQuantity = stockQuantity;
                product.lowStockThreshold = lowStockThreshold;
                product.availability = stockQuantity > 0
                    ? 'In Stock'
                    : 'Out of Stock';
            }

            const result = await productsCollection.insertOne(product);

            res.status(201).send({
                success: true,
                message: 'Product added successfully',
                insertedId: result.insertedId
            });

        } catch (error) {
            console.error('Add product error:', error);

            res.status(500).send({
                message: 'Failed to add product'
            });
        }
    });

    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    // PRODUCT SEARCH API
    // ==========================================
    app.get('/products/search', async (req, res) => {
      try {
        const searchText = String(req.query.q || '').trim();

        if (!searchText) {
          return res.status(200).send([]);
        }

        if (searchText.length > 100) {
          return res.status(400).send({
            message: 'Search query is too long'
          });
        }

        // Escape special regex characters
        const escapedSearch = searchText.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        );

        const products = await productsCollection
          .find({
            name: {
              $regex: escapedSearch,
              $options: 'i'
            }
          })
          .project({
            name: 1,
            price: 1,
            sale: 1,
            images: 1,
            category: 1,
            availability: 1
          })
          .limit(8)
          .toArray();

        res.status(200).send(products);

      } catch (error) {
        console.error('Product search error:', error);

        res.status(500).send({
          message: 'Failed to search products'
        });
      }
    });

    // Update an existing product
    app.patch('/products/:id', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const item = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: 'Invalid product ID'
                });
            }

            if (!item || typeof item !== 'object') {
                return res.status(400).send({
                    message: 'Invalid product data'
                });
            }

            const filter = {
                _id: new ObjectId(id)
            };

            const existingProduct = await productsCollection.findOne(filter);

            if (!existingProduct) {
                return res.status(404).send({
                    message: 'Product not found'
                });
            }

            const updatedFields = {};

            // Update only the fields provided by the frontend.
            // This helps preserve fields belonging to older products.

            if (item.name !== undefined) {
                const name = String(item.name).trim();

                if (!name) {
                    return res.status(400).send({
                        message: 'Product name is required'
                    });
                }

                updatedFields.name = name;
            }

            if (item.category !== undefined) {
                const category = String(item.category).trim();

                if (!category) {
                    return res.status(400).send({
                        message: 'Product category is required'
                    });
                }

                updatedFields.category = category;
            }

            if (item.price !== undefined) {
                const price = Number(item.price);

                if (!Number.isFinite(price) || price < 0) {
                    return res.status(400).send({
                        message: 'Please provide a valid product price'
                    });
                }

                updatedFields.price = price;
            }

            if (item.sale !== undefined) {
                updatedFields.sale = item.sale;
            }

            if (item.rating !== undefined) {
                const rating = Number(item.rating);

                if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
                    return res.status(400).send({
                        message: 'Rating must be between 0 and 5'
                    });
                }

                updatedFields.rating = rating;
            }

            if (item.description !== undefined) {
                updatedFields.description = String(item.description);
            }

            if (item.images !== undefined) {
                if (!Array.isArray(item.images)) {
                    return res.status(400).send({
                        message: 'Images must be an array'
                    });
                }

                updatedFields.images = item.images.filter(
                    image => typeof image === 'string' && image.trim()
                );
            }

            const stockWasProvided =
                item.stockQuantity !== undefined &&
                item.stockQuantity !== null &&
                item.stockQuantity !== '';

            if (stockWasProvided) {
                const stockQuantity = Number(item.stockQuantity);

                if (
                    !Number.isSafeInteger(stockQuantity) ||
                    stockQuantity < 0
                ) {
                    return res.status(400).send({
                        message: 'Stock quantity must be a non-negative integer'
                    });
                }

                const lowStockThreshold =
                    item.lowStockThreshold === undefined ||
                    item.lowStockThreshold === ''
                        ? Number(existingProduct.lowStockThreshold ?? 10)
                        : Number(item.lowStockThreshold);

                if (
                    !Number.isSafeInteger(lowStockThreshold) ||
                    lowStockThreshold < 0
                ) {
                    return res.status(400).send({
                        message: 'Low stock threshold must be a non-negative integer'
                    });
                }

                updatedFields.stockQuantity = stockQuantity;
                updatedFields.lowStockThreshold = lowStockThreshold;
                updatedFields.availability = stockQuantity > 0
                    ? 'In Stock'
                    : 'Out of Stock';
            } else if (item.availability !== undefined) {
                // Keep the existing availability behavior for older products
                // until their stock quantity is configured.
                if (
                    item.availability !== 'In Stock' &&
                    item.availability !== 'Out of Stock'
                ) {
                    return res.status(400).send({
                        message: 'Invalid availability value'
                    });
                }

                updatedFields.availability = item.availability;
            }

            updatedFields.updatedAt = new Date();

            const result = await productsCollection.updateOne(
                filter,
                {
                    $set: updatedFields
                }
            );

            res.send({
                success: true,
                message: 'Product updated successfully',
                modifiedCount: result.modifiedCount
            });

        } catch (error) {
            console.error('Update product error:', error);

            res.status(500).send({
                message: 'Failed to update product'
            });
        }
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

    

   
// Post a comment on a blog
    app.post('/blogs/:id/comments', async (req, res) => {
        try {
            const { id } = req.params;
            const { commentText, name, email, photo } = req.body;

            // Validate blog ID
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid blog ID.'
                });
            }

            // Validate required fields
            if (
                !commentText ||
                !commentText.trim() ||
                !name ||
                !name.trim() ||
                !email ||
                !email.trim()
            ) {
                return res.status(400).send({
                    success: false,
                    message: 'Comment, name, and email are required.'
                });
            }

            // Check whether the blog exists
            const blog = await blogsCollection.findOne({
                _id: new ObjectId(id)
            });

            if (!blog) {
                return res.status(404).send({
                    success: false,
                    message: 'Blog not found.'
                });
            }

            // Prepare comment data
            const newComment = {
                blogId: new ObjectId(id),
                commentText: commentText.trim(),
                name: name.trim(),
                email: email.trim(),
                photo: photo || '',
                createdAt: new Date()
            };

            // Save comment to MongoDB
            const result = await commentsCollection.insertOne(newComment);

            return res.status(201).send({
                success: true,
                message: 'Comment posted successfully.',
                insertedId: result.insertedId,
                comment: {
                    _id: result.insertedId,
                    ...newComment
                }
            });

        } catch (error) {
            console.error('Error posting blog comment:', error);

            return res.status(500).send({
                success: false,
                message: 'Failed to post comment.'
            });
        }
    });


    app.get('/blogs/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({
                message: 'Invalid blog ID'
            });
        }

        const comments = await commentsCollection
            .find({ blogId: new ObjectId(id) })
            .sort({ createdAt: -1, _id: -1 })
            .toArray();

        return res.status(200).send(comments);

    } catch (error) {
        console.error('Error fetching blog comments:', error);

        return res.status(500).send({
            message: 'Failed to fetch blog comments'
        });
    }
    });

   // Cart APIs

    // Add product to cart or update existing product quantity
    app.post('/carts', async (req, res) => {
        try {
            const {
                cartId,
                email,
                product,
                image,
                price,
                quantity
            } = req.body;

            if (!cartId || !email || !product) {
                return res.status(400).send({
                    message: 'Product ID, email and product name are required.'
                });
            }

            if (!ObjectId.isValid(String(cartId))) {
                return res.status(400).send({
                    message: 'Invalid product ID.'
                });
            }

            const requestedQuantity = Number(quantity);

            if (
                !Number.isSafeInteger(requestedQuantity) ||
                requestedQuantity <= 0
            ) {
                return res.status(400).send({
                    message: 'Quantity must be a positive integer.'
                });
            }

            const numericPrice = Number(price);

            if (!Number.isFinite(numericPrice) || numericPrice < 0) {
                return res.status(400).send({
                    message: 'Invalid product price.'
                });
            }

            const productObjectId = new ObjectId(String(cartId));

            // Check that the product exists.
            const productInfo = await productsCollection.findOne({
                _id: productObjectId
            });

            if (!productInfo) {
                return res.status(404).send({
                    message: 'Product not found.'
                });
            }

            // Check available stock when stock tracking is enabled.
            const hasStock =
                productInfo.stockQuantity !== undefined &&
                productInfo.stockQuantity !== null &&
                productInfo.stockQuantity !== '';

            if (hasStock) {
                const stock = Number(productInfo.stockQuantity);

                if (!Number.isSafeInteger(stock) || stock < 0) {
                    return res.status(409).send({
                        message: 'Product stock information is invalid.'
                    });
                }

                if (
                    productInfo.availability === 'Out of Stock' ||
                    stock < requestedQuantity
                ) {
                    return res.status(409).send({
                        message: `Insufficient stock. Available quantity: ${stock}.`
                    });
                }
            }

            const filter = {
                email: email,
                cartId: {
                    $in: [
                        String(cartId),
                        productObjectId
                    ]
                }
            };

            const existingItems = await cartsCollection
                .find(filter)
                .sort({ _id: 1 })
                .toArray();

            if (existingItems.length > 0) {
                const existingQuantity = existingItems.reduce(
                    (total, item) => total + (Number(item.quantity) || 1),
                    0
                );

                const updatedQuantity =
                    existingQuantity + requestedQuantity;

                if (hasStock && updatedQuantity > Number(productInfo.stockQuantity)) {
                    return res.status(409).send({
                        message: `Insufficient stock. Available quantity: ${productInfo.stockQuantity}.`
                    });
                }

                const primaryItem = existingItems[0];

                await cartsCollection.updateOne(
                    { _id: primaryItem._id },
                    {
                        $set: {
                            quantity: updatedQuantity,
                            product: productInfo.name,
                            image: productInfo.images?.[0] || image || '',
                            price: Number(productInfo.price),
                            cartId: String(productObjectId)
                        }
                    }
                );

                // Remove any duplicate rows for the same product.
                if (existingItems.length > 1) {
                    await cartsCollection.deleteMany({
                        _id: {
                            $in: existingItems
                                .slice(1)
                                .map(item => item._id)
                        }
                    });
                }

                return res.status(200).send({
                    success: true,
                    message: 'Cart quantity updated.',
                    updated: true,
                    quantity: updatedQuantity
                });
            }

            const cartItem = {
                cartId: String(productObjectId),
                email: email,
                product: productInfo.name,
                image: productInfo.images?.[0] || image || '',
                price: Number(productInfo.price),
                quantity: requestedQuantity,
                createdAt: new Date()
            };

            const result = await cartsCollection.insertOne(cartItem);

            return res.status(201).send({
                success: true,
                message: 'Product added to cart.',
                insertedId: result.insertedId
            });

        } catch (error) {
            console.error('Add to cart error:', error);

            return res.status(500).send({
                message: 'Failed to add product to cart.'
            });
        }
    });


    // Get cart items
    app.get('/carts', async (req, res) => {
        try {
            const email = req.query.email;

            if (!email) {
                return res.status(400).send({
                    message: 'Email is required.'
                });
            }

            const result = await cartsCollection
                .find({ email: email })
                .sort({ createdAt: -1, _id: -1 })
                .toArray();

            return res.status(200).send(result);

        } catch (error) {
            console.error('Fetch cart error:', error);

            return res.status(500).send({
                message: 'Failed to fetch cart items.'
            });
        }
    });


    // Delete one cart item
    app.delete('/carts/:id', async (req, res) => {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: 'Invalid cart item ID.'
                });
            }

            const email = req.query.email;

            if (!email) {
                return res.status(400).send({
                    message: 'Email is required.'
                });
            }

            const result = await cartsCollection.deleteOne({
                _id: new ObjectId(id),
                email: email
            });

            if (result.deletedCount === 0) {
                return res.status(404).send({
                    message: 'Cart item not found.'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Cart item deleted successfully.',
                deletedCount: result.deletedCount
            });

        } catch (error) {
            console.error('Delete cart item error:', error);

            return res.status(500).send({
                message: 'Failed to delete cart item.'
            });
        }
    });


    // Clear all cart items for a user
    app.delete('/carts', async (req, res) => {
        try {
            const email = req.query.email;

            if (!email) {
                return res.status(400).send({
                    message: 'Email is required.'
                });
            }

            const result = await cartsCollection.deleteMany({
                email: email
            });

            return res.status(200).send({
                success: true,
                message: 'Cart cleared successfully.',
                deletedCount: result.deletedCount
            });

        } catch (error) {
            console.error('Clear cart error:', error);

            return res.status(500).send({
                message: 'Failed to clear cart.'
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

    
    // Create order and deduct stock safely.
    app.post('/orders', verifyToken, async (req, res) => {
        let session;

        try {
            const order = req.body;
            const userEmail = req.decoded.email;

            // Verify authenticated user.
            if (!userEmail || order.email !== userEmail) {
                return res.status(403).send({
                    message: 'Forbidden access! Email does not match.'
                });
            }

            // Validate cart.
            if (!Array.isArray(order.cart) || order.cart.length === 0) {
                return res.status(400).send({
                    message: 'Your cart is empty.'
                });
            }

            // Validate payment method.
            const allowedPaymentMethods = [
                'cash',
                'bkash',
                'nagad',
                'rocket',
                'upay'
            ];

            if (!allowedPaymentMethods.includes(order.paymentMethod)) {
                return res.status(400).send({
                    message: 'Invalid payment method.'
                });
            }

            // Online payment is currently a simulated payment flow.
            if (order.paymentMethod !== 'cash') {
                if (
                    order.isDemoPayment !== true ||
                    order.paymentStatus !== 'demo_success'
                ) {
                    return res.status(400).send({
                        message: 'Payment has not been completed successfully.'
                    });
                }
            }

            // Validate product IDs and quantities.
            const quantitiesByProduct = new Map();

            for (const item of order.cart) {
                const productId = String(item.productId || '');
                const quantity = Number(item.quantity);

                if (!ObjectId.isValid(productId)) {
                    return res.status(400).send({
                        message: 'Invalid product ID in cart.'
                    });
                }

                if (
                    !Number.isSafeInteger(quantity) ||
                    quantity <= 0
                ) {
                    return res.status(400).send({
                        message: 'Invalid product quantity.'
                    });
                }

                const existingQuantity =
                    quantitiesByProduct.get(productId) || 0;

                const combinedQuantity = existingQuantity + quantity;

                if (!Number.isSafeInteger(combinedQuantity)) {
                    return res.status(400).send({
                        message: 'Invalid total product quantity.'
                    });
                }

                quantitiesByProduct.set(productId, combinedQuantity);
            }

            session = client.startSession();

            let insertedId = null;
            let calculatedTotal = 0;

            await session.withTransaction(async () => {
                const preparedItems = [];
                calculatedTotal = 0;

                // Check every product and its current stock.
                for (const [productId, quantity] of quantitiesByProduct) {
                    const product = await productsCollection.findOne(
                        { _id: new ObjectId(productId) },
                        { session }
                    );

                    if (!product) {
                        const error = new Error(
                            'A product in your cart no longer exists.'
                        );
                        error.statusCode = 404;
                        throw error;
                    }

                    // Do not treat missing stock data as unlimited stock.
                    if (
                        !Number.isSafeInteger(product.stockQuantity) ||
                        product.stockQuantity < 0
                    ) {
                        const error = new Error(
                            `${product.name} does not have valid stock information. Please contact the shop.`
                        );
                        error.statusCode = 409;
                        throw error;
                    }

                    if (
                        product.availability === 'Out of Stock' ||
                        product.stockQuantity < quantity
                    ) {
                        const error = new Error(
                            `Insufficient stock for "${product.name}". Available quantity: ${product.stockQuantity}.`
                        );
                        error.statusCode = 409;
                        throw error;
                    }

                    const originalPrice = Number(product.price);

                    if (
                        !Number.isFinite(originalPrice) ||
                        originalPrice < 0
                    ) {
                        const error = new Error(
                            `Invalid price for "${product.name}".`
                        );
                        error.statusCode = 409;
                        throw error;
                    }

                    // Preserve the existing numeric sale-price convention:
                    // use sale when it is a positive price below the original price.
                    const salePrice = Number(product.sale);

                    const unitPrice =
                        product.sale !== '' &&
                        product.sale !== null &&
                        product.sale !== undefined &&
                        Number.isFinite(salePrice) &&
                        salePrice > 0 &&
                        salePrice < originalPrice
                            ? salePrice
                            : originalPrice;

                    const lineTotal = unitPrice * quantity;

                    if (!Number.isFinite(lineTotal)) {
                        const error = new Error(
                            'Unable to calculate order total.'
                        );
                        error.statusCode = 400;
                        throw error;
                    }

                    calculatedTotal += lineTotal;

                    preparedItems.push({
                        productId,
                        productName: product.name,
                        quantity,
                        price: unitPrice,
                        image: Array.isArray(product.images)
                            ? product.images[0] || ''
                            : '',
                        total: lineTotal
                    });
                }

                if (!Number.isFinite(calculatedTotal)) {
                    const error = new Error('Invalid order total.');
                    error.statusCode = 400;
                    throw error;
                }

                // Deduct stock using a conditional update.
                // This prevents a product from being oversold.
                for (const [productId, quantity] of quantitiesByProduct) {
                    const filter = {
                        _id: new ObjectId(productId),
                        stockQuantity: { $gte: quantity }
                    };

                    const product = await productsCollection.findOne(
                        { _id: new ObjectId(productId) },
                        { session }
                    );

                    if (!product) {
                        const error = new Error(
                            'A product in your cart could not be found.'
                        );
                        error.statusCode = 404;
                        throw error;
                    }

                    const newStock = product.stockQuantity - quantity;

                    const result = await productsCollection.updateOne(
                        filter,
                        {
                            $set: {
                                stockQuantity: newStock,
                                availability: newStock > 0
                                    ? 'In Stock'
                                    : 'Out of Stock',
                                updatedAt: new Date()
                            }
                        },
                        { session }
                    );

                    if (result.modifiedCount !== 1) {
                        const error = new Error(
                            `Stock changed for "${product.name}". Please refresh your cart and try again.`
                        );
                        error.statusCode = 409;
                        throw error;
                    }
                }

                // Build the order using verified database values.
                const newOrder = {
                    ...order,

                    email: userEmail,
                    cart: preparedItems,
                    totalPrice: calculatedTotal,

                    status: 'pending',

                    paymentStatus: order.paymentMethod === 'cash'
                        ? 'pending'
                        : 'demo_success',

                    stockDeducted: true,
                    stockRestored: false,

                    createdAt: new Date(),

                    statusHistory: [
                        {
                            status: 'pending',
                            changedAt: new Date(),
                            changedBy: userEmail
                        }
                    ]
                };

                // Remove any client-supplied identifier.
                delete newOrder._id;

                const result = await ordersCollection.insertOne(
                    newOrder,
                    { session }
                );

                insertedId = result.insertedId;
            });

            return res.status(201).send({
                success: true,
                message: 'Order placed successfully.',
                insertedId,
                totalPrice: calculatedTotal
            });

        } catch (error) {
            console.error('Order creation failed:', error);

            return res.status(error.statusCode || 500).send({
                message: error.statusCode
                    ? error.message
                    : 'Failed to place order. Please try again.'
            });

        } finally {
            if (session) {
                await session.endSession();
            }
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


    // Update order status from Admin Dashboard
    app.patch('/orders/:id/status', verifyToken, verifyAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: 'Invalid order ID'
                });
            }

            const allowedStatuses = [
                'pending',
                'confirmed',
                'processing',
                'packed',
                'shipped',
                'out_for_delivery',
                'delivered',
                'cancelled'
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).send({
                    message: 'Invalid order status'
                });
            }

            const order = await ordersCollection.findOne({
                _id: new ObjectId(id)
            });

            if (!order) {
                return res.status(404).send({
                    message: 'Order not found'
                });
            }

            if (
                order.status === 'delivered' ||
                order.status === 'cancelled'
            ) {
                return res.status(409).send({
                    message: `Cannot update an order with status "${order.status}"`
                });
            }

            const now = new Date();

            const result = await ordersCollection.updateOne(
                {
                    _id: new ObjectId(id),
                    status: order.status
                },
                {
                    $set: {
                        status,
                        updatedAt: now
                    },
                    $push: {
                        statusHistory: {
                            status,
                            changedAt: now,
                            changedBy: req.decoded.email
                        }
                    }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(409).send({
                    message: 'Order status changed. Please refresh and try again.'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Order status updated successfully',
                status
            });

        } catch (error) {
            console.error('Admin order status update error:', error);

            return res.status(500).send({
                message: 'Failed to update order status'
            });
        }
    });

    // Customer cancels a pending order and restores stock.
    app.patch('/orders/:id/cancel', verifyToken, async (req, res) => {
        let session;

        try {
            const { id } = req.params;
            const userEmail = req.decoded.email;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: 'Invalid order ID.'
                });
            }

            session = client.startSession();

            let cancelledOrder = null;

            await session.withTransaction(async () => {
                const orderFilter = {
                    _id: new ObjectId(id),
                    email: userEmail,
                    status: 'pending'
                };

                const order = await ordersCollection.findOne(
                    orderFilter,
                    { session }
                );

                if (!order) {
                    const error = new Error(
                        'Order not found or cannot be cancelled.'
                    );
                    error.statusCode = 404;
                    throw error;
                }

                // Restore stock only if this order previously deducted it.
                await restoreOrderStock(order, session);

                const now = new Date();

                const updateResult = await ordersCollection.updateOne(
                    {
                        _id: order._id,
                        email: userEmail,
                        status: 'pending'
                    },
                    {
                        $set: {
                            status: 'cancelled',
                            cancelledAt: now,
                            updatedAt: now,
                            stockRestored: order.stockDeducted === true
                                ? true
                                : order.stockRestored || false
                        },
                        $push: {
                            statusHistory: {
                                status: 'cancelled',
                                changedAt: now,
                                changedBy: userEmail
                            }
                        }
                    },
                    { session }
                );

                if (updateResult.modifiedCount !== 1) {
                    const error = new Error(
                        'Order status changed. Please refresh and try again.'
                    );
                    error.statusCode = 409;
                    throw error;
                }

                cancelledOrder = {
                    _id: order._id,
                    status: 'cancelled'
                };
            });

            return res.status(200).send({
                success: true,
                message: 'Order cancelled successfully.',
                order: cancelledOrder
            });

        } catch (error) {
            console.error('Order cancellation failed:', error);

            return res.status(error.statusCode || 500).send({
                message: error.statusCode
                    ? error.message
                    : 'Failed to cancel order.'
            });

        } finally {
            if (session) {
                await session.endSession();
            }
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


    // Customer cancels a pending order and restores stock.
    app.patch('/orders/:id/cancel', verifyToken, async (req, res) => {
        let session;

        try {
            const { id } = req.params;
            const userEmail = req.decoded.email;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: 'Invalid order ID.'
                });
            }

            session = client.startSession();

            let cancelledOrder = null;

            await session.withTransaction(async () => {
                const orderFilter = {
                    _id: new ObjectId(id),
                    email: userEmail,
                    status: 'pending'
                };

                const order = await ordersCollection.findOne(
                    orderFilter,
                    { session }
                );

                if (!order) {
                    const error = new Error(
                        'Order not found or cannot be cancelled.'
                    );
                    error.statusCode = 404;
                    throw error;
                }

                // Restore stock only if this order previously deducted it.
                await restoreOrderStock(order, session);

                const now = new Date();

                const updateResult = await ordersCollection.updateOne(
                    {
                        _id: order._id,
                        email: userEmail,
                        status: 'pending'
                    },
                    {
                        $set: {
                            status: 'cancelled',
                            cancelledAt: now,
                            updatedAt: now,
                            stockRestored: order.stockDeducted === true
                                ? true
                                : order.stockRestored || false
                        },
                        $push: {
                            statusHistory: {
                                status: 'cancelled',
                                changedAt: now,
                                changedBy: userEmail
                            }
                        }
                    },
                    { session }
                );

                if (updateResult.modifiedCount !== 1) {
                    const error = new Error(
                        'Order status changed. Please refresh and try again.'
                    );
                    error.statusCode = 409;
                    throw error;
                }

                cancelledOrder = {
                    _id: order._id,
                    status: 'cancelled'
                };
            });

            return res.status(200).send({
                success: true,
                message: 'Order cancelled successfully.',
                order: cancelledOrder
            });

        } catch (error) {
            console.error('Order cancellation failed:', error);

            return res.status(error.statusCode || 500).send({
                message: error.statusCode
                    ? error.message
                    : 'Failed to cancel order.'
            });

        } finally {
            if (session) {
                await session.endSession();
            }
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

    // Billing Address APIs

    // Save billing address
    app.post(['/billing', '/billings'], async (req, res) => {
        try {
            const bill = req.body;

            if (!bill.email) {
                return res.status(400).send({
                    message: 'Email is required'
                });
            }

            const result = await billingsCollection.insertOne({
                ...bill,
                createdAt: new Date()
            });

            res.status(201).send({
                message: 'Billing address saved successfully',
                insertedId: result.insertedId
            });
        } catch (error) {
            console.error('Billing address save error:', error);

            res.status(500).send({
                message: 'Failed to save billing address'
            });
        }
    });


    // Update an existing billing address
    app.patch('/billings/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const userEmail = req.decoded.email;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: 'Invalid billing address ID'
                });
            }

            const {
                fullname,
                companyname,
                streetaddress,
                division,
                district,
                zipcode,
                phone
            } = req.body;

            // Validate required fields
            if (
                !fullname?.trim() ||
                !streetaddress?.trim() ||
                !division ||
                !district ||
                !phone?.trim()
            ) {
                return res.status(400).send({
                    message: 'Please provide all required billing information'
                });
            }

            // Only allow users to update their own billing address
            const filter = {
                _id: new ObjectId(id),
                email: userEmail
            };

            const existingBilling = await billingsCollection.findOne(filter);

            if (!existingBilling) {
                return res.status(404).send({
                    message: 'Billing address not found'
                });
            }

            const updatedBilling = {
                fullname: fullname.trim(),
                companyname: String(companyname || '').trim(),
                streetaddress: streetaddress.trim(),
                division,
                district,
                zipcode: String(zipcode || '').trim(),
                phone: phone.trim(),
                updatedAt: new Date()
            };

            const result = await billingsCollection.updateOne(
                filter,
                {
                    $set: updatedBilling
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).send({
                    message: 'Billing address not found'
                });
            }

            const savedBilling = await billingsCollection.findOne(filter);

            return res.status(200).send({
                success: true,
                message: 'Billing address updated successfully',
                billing: savedBilling
            });

        } catch (error) {
            console.error('Billing address update error:', error);

            return res.status(500).send({
                message: 'Failed to update billing address'
            });
        }
    });

    // Get billing address
    app.get(['/billing', '/billings'], async (req, res) => {
        try {
            const email = req.query.email;

            if (!email) {
                return res.status(400).send({
                    message: 'Email is required'
                });
            }

            const result = await billingsCollection
                .find({ email: email })
                .sort({ createdAt: -1, _id: -1 })
                .toArray();

            res.status(200).send(result);
        } catch (error) {
            console.error('Billing address fetch error:', error);

            res.status(500).send({
                message: 'Failed to fetch billing address'
            });
        }
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

        // ==========================================
    // BLOGS RELATED APIs
    // ==========================================

    // Get all blogs
    app.get('/blogs', async (req, res) => {
        try {
            const blogs = await blogsCollection
                .find()
                .sort({ _id: -1 })
                .toArray();

            return res.status(200).send(blogs);

        } catch (error) {
            console.error('Error fetching blogs:', error);

            return res.status(500).send({
                message: 'Failed to fetch blogs'
            });
        }
    });


    // Get a single blog by ID
    app.get('/blogs/:id', async (req, res) => {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: 'Invalid blog ID'
                });
            }

            const blog = await blogsCollection.findOne({
                _id: new ObjectId(id)
            });

            if (!blog) {
                return res.status(404).send({
                    message: 'Blog not found'
                });
            }

            return res.status(200).send(blog);

        } catch (error) {
            console.error('Error fetching blog:', error);

            return res.status(500).send({
                message: 'Failed to fetch blog'
            });
        }
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get("/", (req, res) => {
      res.send("Shopery Server is Running");
    });

    app.listen(port, () => {
      console.log(`Shopery is running on port ${port}`);
    });
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

module.exports = app;