const express = require('express');
const router = express.Router();
const passport = require('passport');
const { unlink } = require('fs-extra');



//Products
const Producto = require('../models/producto');
const User= require('../models/user');
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



router.get('/formularioProducto/:id',isAuthenticated, async(req, res, next) => {
  console.log(req.params.id);
  const user = await User.findById(req.params.id).lean();
    console.log(user);
    if (user.email=== 'admin@localhost'){
      res.render('formularioproducto');
      
    }else{
      res.redirect('/');
    }
    
  
});

router.post('/registrarProducto', isAuthenticated, async(req, res, next)=>{
  const producto = new Producto();
  producto.nombre = req.body.nombre;
  producto.precio = req.body.precio;
  producto.cantidad = req.body.cantidad;
  producto.categoria = req.body.categoria;
  producto.filename = req.file.filename;
  producto.path = '/images/uploads/' + req.file.filename;
  producto.originalname = req.file.originalname;
  producto.mimetype = req.file.mimetype;
  producto.size = req.file.size;
  await producto.save();
  res.redirect('/');
});


router.post('/orden',isAuthenticated, async(req,res,next)=>{
  console.log(req.body.email)
  res.redirect('checkout')
})
/*
router.get('/albums', async (req, res) => {
  const productos = await Producto.find();
  console.log(productos);
  res.render('albums', { productos });
});
*/
router.get('/albums', async(req, res, next) =>{
  const productos = await Producto.find();
  //console.log(productos);
  res.render('albums', {productos});
});

router.get('/checkout',isAuthenticated, (req,res,next)=>{
  res.render('checkout');
});

router.get('/lightsticks', async(req, res, next) =>{
  const productos = await Producto.find();
  //console.log(productos);
  res.render('lightsticks',{productos});
});
router.get('/preventas', async(req, res, next) =>{
  const productos = await Producto.find();
  //console.log(productos);
  res.render('preventas',{productos});
});


router.get('/renderProduct/:id',isAuthenticated, async(req, res)=>{
  console.log(req.params.id);
  const product = await Product.findById(req.params.id).lean();
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