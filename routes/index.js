// controllers
const user = require('../controllers/index')
const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const multer = require("multer");
const PATH = 'public';
const date = new Date();
const year = date.getUTCFullYear(),
    month = date.getUTCMonth() + 1;
const weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let day = weekday[date.getDay()];
const time = date.getHours() + ":" + date.getMinutes();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files');
    },
    filename: (req, file, cb) => {
        cb(null, month + '-' + day + '-' + file.originalname)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .pdf'));
        }
    }
});

router
    /* GET home page. */
    .get('/', (req,res) => {
        res.render('index', {title: 'APPLY: Top Skills Masterclass Bundle'});
    })
    .post('/gift', user.giftUser)
    .post('/api/image', upload.single('myfile'), user.imageUpload)
    .post('/api/formdata', user.pay)
module.exports = router;