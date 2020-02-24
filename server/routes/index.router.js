const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const stripe = require('stripe')('sk_test_o7851E847CPTTCX8RpeCvmsL00zx9qYNQG')
const mongoose = require('mongoose');
const ctrlUser = require('../controllers/user.controllers');
const jwtHelper = require('../config/jwtHelper');
const Record = mongoose.model('Record');
const Address = mongoose.model('Address')
const Checkout = mongoose.model('Checkout');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: '/home/ulcom20/Desktop/meanlogin/Angular/src/assets/image',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
    }
})
const upload = multer({ storage: storage })
router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/getrecord', ctrlUser.getrecord)
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/insert', upload.single('file'), ((req, res) => {
    var record = new Record();
    record.name = req.body.name;
    record.category = req.body.category
    record.quantity = req.body.quantity;
    record.price = req.body.price;
    record.description = req.body.description;
    record.imagePath = req.file
    record.save((err, doc) => {
        if (!err)
            res.send(doc);
        else
            res.send(err);
    });
}))
router.post('/address', (req, res) => {

    var address = new Address();
    address.name = req.body.name;
    address.no = req.body.no;
    address.pincode = req.body.pincode;
    address.locality = req.body.locality
    address.address = req.body.address;
    address.district = req.body.city;
    console.log(address.district)
    address.state = req.body.selector
    token = req.headers['authorization'];
    token = req.headers['authorization'].split(' ')[1];
    var result = jwt.verify(token, process.env.JWT_SECRET)
    console.log(result._id)
    address.addressid = result._id
    console.log(address.addressid)
    address.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            res.send(err);
        }
    });
})

router.get('/address', async(req, res) => {
 let    addarray = []
  let  dataarray = []
    let checkout =await Checkout.find()
    let dat = await Address.find()
     for (let data of checkout) {
        for (let ele of dat) {
            if (data.id == ele.addressid) {
                addarray.push(ele)
                dataarray=data.productid
                  }
        }
    }
    console.log(dataarray, addarray)
    res.send({ dataarray, addarray })
})
router.post('/payemnt', (req, res) => {
    var charge = stripe.charges.create({
        amount: req.body.amount,
        currency: 'INR',
        source: req.body.token
    }, (err, charge) => {
        if (err) {
            throw err;
        }
        res.json({
            success: true,
            message: "payment done"
        })
    })
})

router.delete('/:id', (req, res) => {
    Record.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) {
            console.log('successfull')
            res.send(docs)
        }
        else {
            console.log("error in collection Delete" + JSON.stringify(err, undefined, 2))
        }
    });
})
router.put('/:id', upload.single('file'), (req, res) => {
    var emp = {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        description: req.body.description,
        imagePath: req.file
    };
    console.log(emp.description)
    Record.findByIdAndUpdate(req.params.id, { $set: emp }, (err, docs) => {
        if (!err) {
            res.send(docs)
            console.log(emp)
        }
        else {
            console.log("error in employee update" + JSON.stringify(err, undefined, 2))
        }
    })
})
data = [];
router.get('/:id', (req, res) => {
    Record.findById(req.params.id, (err, docs) => {
        if (!err) {
            token = req.headers['authorization'];
            token = req.headers['authorization'].split(' ')[1];
            var result = jwt.verify(token, process.env.JWT_SECRET)
            data.push(docs)
            let checkout = new Checkout()
            checkout.id = result._id
            checkout.productid = data
            checkout.save()
            res.send(data);
        }
        else {
            res.send(err)
        }
    });
})
router.get('/getrecord', ctrlUser.getrecord)
module.exports = router;