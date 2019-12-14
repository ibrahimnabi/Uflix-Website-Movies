const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
// models
const User = require("../models/Users");
const Movie = require("../models/Movies");
const Complaint = require("../models/Complaints");
const Support = require("../models/Support");
const Demand = require("../models/On-Demand-Movies");
const Feedback = require("../models/Feedback");
const keys = require("../config/keys");
const validateRegisterInput = require("../validation/users/register");
const validateLoginInput = require("../validation/users/login");
const validateUpdateInput = require("../validation/users/update-profile");
exports.REGISTER_USER = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        return res
          .status(409)
          .json({ email: "Email Or Card Number already exists" });
      }
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({ Error: err });
          } else {
            const { email, fname, lname } = req.body;
            const newUser = new User({
              email,
              password: hash,
              fname,
              lname
              //   cardNumber,
              //   cardExpirationDate,
              //   cardCVV
            });
            newUser.save().then(user => {
              console.log("New User: ", user);
              res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user
              });
            });
          }
        });
      });
    })
    .catch(err => {
      if (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          // Duplicate username
          return res.status(422).send({
            succes: false,
            message: "User with this profile data is already exist!"
          });
        }
      }
    });
};

exports.LOGIN_USER = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({ emailNotFound: "Email not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //jwt_payload
          const payload = {
            id: user.id,
            name: user.name
          };
          jwt.sign(
            payload,
            keys.secret,
            { expiresIn: 31556926 },
            (err, token) => {
              if (err) throw err;
              return res.status(200).json({
                success: true,
                message: "Successfully Logged In",
                token: "Bearer" + " " + token,
                currentUser: user
              });
            }
          );
        } else {
          return res
            .status(500)
            .json({ success: false, passwordIncorrect: "Password incorrect" });
        }
      });
    });
};

exports.UPDATE_USER = (req, res, next) => {
  const { errors, isValid } = validateUpdateInput(req.body);
  const { id } = req.params;
  if (!isValid) {
    res.status(400).json(errors);
  }
  User.findByIdAndUpdate(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, Error: "User not found" });
      }
      user.fname = req.body.fname;
      user.lname = req.body.lname;
      user.email = req.body.email;
      user.password = req.body.password;
      //   user.cardNumber = req.body.cardNumber;
      //   user.cardExpirationDate = req.body.cardExpirationDate;
      //   user.cardCVV = req.body.cardCVV;
      user.save();
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
      });
    })
    .catch(err => {
      if (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          // Duplicate username
          return res.status(422).send({
            succes: false,
            message: "User with this profile data is already exist!"
          });
        }
      }
    });
};

exports.GET_MOVIE = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }

      return res.status(200).json({ success: true, movie });
    })
    .catch(err => {
      console.log("Error Fetching Movie :", err);
    });
};
exports.SEARCH_MOVIE = (req, res, next) => {
  const { query } = req.params;
  var regex = new RegExp(query, "i");
  console.log(regex);
  Movie.find({ title: regex })
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      return res.status(200).json({ success: true, movie });
    })
    .catch(err => {
      console.log("Error Fetching Movie :", err);
    });
};
exports.GET_ALL_MOVIES = async (req, res, next) => {
  Movie.find()
    .exec()
    .then(movies => {
      if (!movies) {
        return res
          .status(404)
          .json({ success: false, message: "Movies not found" });
      }
      User.findById(req.userData.id)
        .exec()
        .then(user => {
          const ids = user.favourites.map(m => m._id);
          const newMovies = movies.map(m => {
            if (ids.includes(m._id)) {
              return Object.assign({}, m._doc, { isFav: true });
            } else {
              return Object.assign({}, m._doc, { isFav: false });
            }
            return m;
          });
          newMovies.forEach(m => console.log(m));

          console.log(ids);
          return res.status(200).json({ success: true, movies: newMovies });
        });
    })
    .catch(err => {
      console.log("Getting all movies error :", err);
    });
};

exports.STREAM = function(req, res) {
  const { id } = req.params;
  Movie.findById(id)
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      const path = String(movie.video[0][0]);
      console.log(path);
      console.log("---------------------------------------------");
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    });
};

exports.GET_ALL_COMPLAINTS = (req, res, next) => {
  Complaint.find()
    .exec()
    .then(allComplaints => {
      if (allComplaints.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Complaints Not Found" });
      }
      res.status(200).json({
        success: true,
        message: "All Complaints",
        allComplaints,
        totalComplaints: allComplaints.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all complaints error :", err });
    });
};

exports.GET_PENDING_DEMANDS = (req, res, next) => {
  Demand.find({ status: false })
    .exec()
    .then(allDemands => {
      if (allDemands.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Demands Not Found" });
      }
      res.status(200).json({
        success: true,
        message: "All Demands",
        allDemands,
        totalDemands: allDemands.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all demands error :", err });
    });
};
exports.GET_ALL_DEMANDS = (req, res, next) => {
  Demand.find()
    .exec()
    .then(allDemands => {
      if (allDemands.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Demands Not Found" });
      }
      res.status(200).json({
        success: true,
        message: "All Demands",
        allDemands,
        totalDemands: allDemands.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all demands error :", err });
    });
};
exports.GET_ALL_FEEDBACK = (req, res, next) => {
  Feedback.find()
    .exec()
    .then(allFeedbacks => {
      if (allFeedbacks.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "There is no feedback exists" });
      }
      res.status(200).json({
        success: true,
        message: "All Feedbacks",
        allFeedbacks,
        totalFeedbacks: allFeedbacks.length
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all feedbacks error :", err });
    });
};

exports.GET_ONE_FEEDBACK = (req, res, next) => {
  const { id } = req.params;
  Feedback.findById(id)
    .exec()
    .then(feedback => {
      if (!feedback) {
        return res
          .status(404)
          .json({ success: false, message: "Feedback not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Feedback found", feedback });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.UPDATE_FEEDBACK = (req, res, next) => {
  const { title, review, ratings } = req.body;
  const { id } = req.params;
  Feedback.findById(id)
    .exec()
    .then(movie => {
      if (!movie) {
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });
      }
      movie.title = title;
      movie.review = review;
      movie.ratings = ratings;
      movie.save();
      res.status(200).json({ success: true, message: "Movie found", movie });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
// exports.GET_MOVIE_FEEDBACK = (req, res, next) => {
//   const { id } = req.params;
//   Feedback.find({_movieId:id})
//     .select("_movieId title review ratings")
//     .exec()
//     .then(movie => {
//       if (!movie) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Movie not found" });
//       }
//       res.status(200).json({ success: true, message: "Movie found", movie });
//     })
//     .catch(err => {
//       res.status(500).json({ Error: err });
//     });
// };
exports.ADD_COMPLAINT = (req, res, next) => {
  const { subject, complaint } = req.body;
  const { id } = req.params;
  User.findById(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const newComplaint = new Complaint({
        _userId: id,
        subject,
        complaint
      });
      return newComplaint.save();
    })
    .then(result => {
      res.status(200).json({
        success: true,
        message: "Complaint registered successfully : ",
        result
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Complaint registration error :", err });
    });
};
exports.ADD_SUPPORT = (req, res, next) => {
  const { subject, phone, query } = req.body;
  const { id } = req.params;
  User.findById(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      const newSupport = new Support({
        _userId: id,
        subject,
        phone,
        query
      });
      return newSupport.save();
    })
    .then(result => {
      res.status(200).json({
        success: true,
        message: "Support registered successfully : ",
        result
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "Support registration error :", err });
    });
};
exports.GET_ALL_SUPPORT = (req, res, next) => {
  Support.find()
    .populate("_userId", "email phone subject query ")
    .exec()
    .then(allSupport => {
      if (allSupport.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Support Not Found" });
      }
      const supports = allSupport.map(element => {
        const { phone, subject, query, _userId } = element;
        const { email } = _userId;
        return {
          phone,
          subject,
          query,
          email
        };
      });
      res
        .status(200)
        .json({ success: true, message: "All Support", allSupport: supports });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all support error :", err });
    });
};

exports.GET_SUPPORT = (req, res, next) => {
  const { id } = req.params;
  Support.findById(id)
    .populate("_userId")
    .exec()
    .then(comp => {
      if (!comp) {
        return res
          .status(404)
          .json({ success: false, message: "Support not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Support found", complaint: comp });
    })
    .catch(err => {
      res.status(500).json({ Error: "Support finding error :", err });
    });
};

exports.ADD_FEEDBACK = (req, res, next) => {
  const { title, review, ratings } = req.body;
  const { id } = req.params;
  User.findById(id)
    .then(result => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      if (result) {
        const newFeedback = new Feedback({
          _userId: id,
          title,
          review,
          ratings
        });
        return newFeedback.save();
      }
    })
    .then(result => {
      res
        .status(200)
        .json({ success: true, result, message: "Thanks for your feedback!" });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.GET_ALL_COMPLAINTS = (req, res, next) => {
  Complaint.find()
    .exec()
    .then(allComplaints => {
      if (allComplaints.length < 0) {
        return res
          .status(404)
          .json({ success: false, message: "Complaints Not Found" });
      }
      res
        .status(200)
        .json({ success: true, message: "All Complaints", allComplaints });
    })
    .catch(err => {
      res.status(500).json({ Error: "Finding all complaints error :", err });
    });
};

exports.GET_COMPLAINT = (req, res, next) => {
  const { id } = req.params;
  Complaint.findById(id)
    .select("_userId subject complaint")
    .populate("_userId")
    .exec()
    .then(comp => {
      if (!comp) {
        return res
          .status(404)
          .json({ success: false, message: "Complaint not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Complaint found", complaint: comp });
    })
    .catch(err => {
      res.status(500).json({ Error: "Complaint finding error :", err });
    });
};

exports.MANAGE_STATUS = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  await Complaint.findById(id)
    .exec()
    .then(uStatus => {
      if (!uStatus) {
        return res
          .status(404)
          .json({ success: false, message: "Complaint not found for this Id" });
      }
      uStatus.status = status;
      console.log(uStatus);
      uStatus.save();
      res.status(200).json({
        success: true,
        message: "Status Changed successfuly",
        uStatus
      });
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
};
exports.ADD_DEMAND = (req, res, next) => {
  const { titles, review } = req.body;
  // console.log(titles);
  const { id } = req.params;
  User.findById(id)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const newDemand = new Demand({
        _userId: id,
        titles,
        review
      });
      return newDemand.save();
    })
    .then(result => {
      return res.status(200).json({
        success: true,
        message: "Demanded Movie registered successfully : ",
        result
      });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ Error: "Demanded Movie registration error :", err });
    });
};
exports.GET_DEMAND = (req, res, next) => {
  const { id } = req.params;
  Demand.findById({ _id: id })
    .select("_userId title1 title2 title3 review")
    .populate("_userId")
    .exec()
    .then(dMovie => {
      if (!dMovie) {
        return res
          .status(404)
          .json({ success: false, message: "Demanded Movie not Found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Demanded Movie found", dMovie });
    })
    .catch(err => {
      res.status(500).json({ Error: "Demanded Movie finding error :", err });
    });
};
exports.UPDATE_DEMAND = (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  Demand.findById({ _id: id })
    .select("_userId title1 title2 title3 review")
    .populate("_userId")
    .exec()
    .then(dMovie => {
      if (!dMovie) {
        return res
          .status(404)
          .json({ success: false, message: "Demanded Movie not Found" });
      }
      dMovie.status = status;
      dMovie.save();
      res
        .status(200)
        .json({ success: true, message: "Demanded Movie found", dMovie });
    })
    .catch(err => {
      res.status(500).json({ Error: "Demanded Movie finding error :", err });
    });
};

exports.ADD_FAVOURATE = (req, res, next) => {
  const { id } = req.params;
  const { favourites } = req.body;
  console.log(id, favourites);

  User.findByIdAndUpdate(id)
    .exec()
    .then(result => {
      if (!result) {
        return result
          .status(404)
          .json({ success: false, message: "User not Found" });
      }
      result.favourites = favourites;
      result.save();
      res.status(200).json({
        success: true,
        message: "favourites Updated",
        favourites: result.favourites
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "favourites finding error :", err });
    });
};

exports.GET_FAVOURATE = (req, res, next) => {
  const { id } = req.params;
  User.findById({ _id: id })
    .exec()
    .then(result => {
      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "User not Found" });
      }
      res.status(200).json({
        success: true,
        message: "favourites Fetched",
        favourites: result.favourites
      });
    })
    .catch(err => {
      res.status(500).json({ Error: "favourites finding error :", err });
    });
};
