const express = require('express');
const router = express.Router();
const passport = require('passport');
const producto = require('../models/producto');

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


router.get('/preventas',(req, res, next) =>{
  res.render('preventas');
});

router.get('/albums',(req, res, next) =>{
  res.render('albums');
});

router.get('/lightsticks',(req, res, next) =>{
  res.render('lightsticks');
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
const Producto = require('../models/producto');

router.get('/formularioProducto',isAuthenticated, (req, res, next) => {
  res.render('formularioproducto');
});

router.post('/agregarProducto', isAuthenticated, async(req, res, next)=>{
  const produto = new Producto();
    produto.nombre = req.body.nombre;
    produto.precio = req.body.precio;
    produto.cantidad = req.body.cantidad;
    produto.categoria = req.body.categoria;
    produto.filename = req.file.filename;
    produto.path = '/img/uploads/' + req.file.filename;
    produto.originalname = req.file.originalname;
    produto.mimetype = req.file.mimetype;
    produto.size = req.file.size;

    await producto.save();
    res.redirect('/');
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