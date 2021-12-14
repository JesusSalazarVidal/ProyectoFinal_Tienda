const express = require('express');
const router = express.Router();
const passport = require('passport');
const { unlink } = require('fs-extra');



//importar los modelos 
const Producto = require('../models/producto');
const User= require('../models/user');


//renderizar la ventanas 
//index
router.get('/', (req, res, next) => {
  res.render('index');
});

//------------------METODOS GET PARA LA SESION DEL USUARIO--------------------------
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});
router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});

//-----------------------METODOS POST PARA LAS SESIONES ---------------------

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  passReqToCallback: true
})); 

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  passReqToCallback: true
}));



//------------------------METODOS GET PARA LOS PRODUCTOS----------------


router.get('/formularioProducto',isAuthenticated, async(req, res, next) => {
  const user = await User.findById(req.session.passport.user).lean();
  if(user.email === 'admin@localhost'){
    res.render('formularioproducto');
  }else{
    res.redirect('/');
  }
  
});

router.get('/productos',isAuthenticated, async(req, res, next) => {
  const user = await User.findById(req.session.passport.user).lean();
  if(user.email === 'admin@localhost'){
    const productos = await Producto.find();
    res.render('productos', {productos});
  }else{
    res.redirect('/');
  }
});

router.get('/albums', async(req, res, next) =>{
  const productos = await Producto.find();
  //console.log(productos);
  res.render('albums', {productos});
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

router.get('/checkout',isAuthenticated, (req,res,next)=>{
  res.render('checkout');
});

router.get('/editarProducto/:id',isAuthenticated, async(req, res)=>{
  console.log(req.params.id);
  const producto = await Producto.findById(req.params.id).lean();
  console.log(producto);
  res.render("formularioEditar", {producto});
});








//-------------------METODOS POST PARA LOS PRODUCTOS------------------------------


router.post('/registrarProducto', isAuthenticated, async(req, res, next)=>{
  const user = await User.findById(req.session.passport.user).lean();
  if(user.email === 'admin@localhost'){
    const producto = new Producto();
    producto.nombre = req.body.nombre;
    producto.precio = req.body.precio;
    producto.cantidad = req.body.cantidad;
    producto.descripcion = req.body.descripcion;
    producto.categoria = req.body.categoria;
    producto.path = '/images/uploads/' + req.file.filename;
    await producto.save();
    req.flash("success_msg", "Producto Agregado");
    res.redirect('productos');
  }else{
    res.redirect('/');
  }
});

router.post('/actualizarProducto/:id',isAuthenticated, async(req,res,next)=>{
  console.log(req.params.id);
  const path = '/images/uploads/' + req.file.filename;
  const { nombre, precio, cantidad, descripcion, categoria} = req.body;
  await Producto.findByIdAndUpdate(req.params.id, { nombre, precio, cantidad, descripcion,categoria, path});
  res.redirect("/productos");
});



router.post('/eliminarProducto/:id',isAuthenticated, async(req,res,netx)=>{
  console.log(req.params.id);
  await Producto.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/productos");
});

router.post('/orden',isAuthenticated, async(req,res,next)=>{
  console.log(req.body.email)
  res.redirect('checkout')
})



function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;