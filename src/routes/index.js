const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  passReqToCallback: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('signin');
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  passReqToCallback: true
}));


router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});
/*
//todos las rutas debajo estaran dentro de la seguridad de las sessions
router.use((req, res, next)=>{
  isAuthenticated(req, res, next);
  next();
});
*/
router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});

//Products
const Product = require('../models/product');

router.get('/regProduct',isAuthenticated, (req, res, next) => {
  res.render('registerProducts');
});

router.post('/add/product', isAuthenticated, async(req, res, next)=>{
  const { nombre, precio, descripcion } = req.body;
  console.log(req.body);
  const errors = [];
  if (!nombre) {
    errors.push({ text: "Ingrese nombre del producto" });
  }
  if (!precio) {
    errors.push({ text: "Ingrese Precio del producto" });
  }
  if (!descripcion) {
    errors.push({ text: "Ingrese descripcion del producto" });
  }
  if (errors.length > 0) {
    console.log(errors);
    res.render("registerProducts", {
      errors,
      nombre,
      precio,
      descripcion,
    });
  } else {
    const newProduct = new Product({ nombre, precio, descripcion});
    newProduct.user = req.user.id;
    await newProduct.save();
    req.flash("success_msg", "Product Added Successfully");
    res.redirect("/products");
  }
});
router.get('/products',isAuthenticated, async(req, res, next) => {
  const products = await Product.find();
  res.render("products", { products });
});

router.get('/renderProduct/:id',isAuthenticated, async(req, res)=>{
  console.log(req.params.id);
  const product = await Product.findById(req.params.id).lean();;
  console.log(product);
  res.render("editProduct", {product});
});

router.post('/updateProduct/:id',isAuthenticated, async(req,res,next)=>{
  console.log(req.params.id);
  const { nombre, precio, descripcion } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { nombre, precio, descripcion });
  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/products");
});

router.post('/deleteProduct/:id',isAuthenticated, async(req,res,netx)=>{
  console.log(req.params.id);
  await Product.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/products");
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;