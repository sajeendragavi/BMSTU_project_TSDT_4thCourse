const { db } = require('../util/admin');

//get course info from Database
exports.getAllCourses = (req, res) => {
    db
        .collection('courses')
        .get()
        .then(data => {
            let courses = [];
            data.forEach((doc) => {
                courses.push({
                    courseCollection_id: doc.id,
                    child_subject: doc.data().child_subject,
                    course_id: doc.data().course_id,
                    course_name: doc.data().course_name,
                    length: doc.data().length,
                    next_session_date: doc.data().next_session_date,
                    parent_subject: doc.data().parent_subject,
                    provider: doc.data().provider,
                    universities: doc.data().universities,
                    url: doc.data().url,
                    video_url: doc.data().video_url
                });
            });
            return res.json(courses);
        })
        .catch((err) => console.error(err));
}


//add courses to Database
exports.addCourses = (req, res) => {
    const newCourse = {
        child_subject: req.body.child_subject,
        course_id: req.body.course_id,
        course_name: req.body.course_name,
        length: req.body.length,
        next_session_date: req.body.next_session_date,
        parent_subject: req.body.parent_subject,
        provider: req.body.provider,
        universities: req.body.universities,
        url: req.body.url,
        video_url: req.body.video_url

    };
    db
        .collection('courses')
        .add(newCourse)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });

}

//like courses 
exports.likeCourses = (req, res) => {
    const likeCourse = {
        courseName: req.body.crsName,
        courseImg: req.body.crsImg,
        courseOrg:req.body.crsOrg,
        courseUni:req.body.crsUni,
        courseLink:req.body.crsLink,
        userEmail:req.body.userEmail,
    };
    db
        .collection('favorites')
        .add(likeCourse)
        .then((doc) => {
            res.json({ message: `like ${doc.id} added successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });

}

//unlike courses 
exports.unLikeCourses = (req, res) => {

    var favCourse = db.collection('favorites').where('courseName', '==', req.body.courseTitle);

    favCourse
        .get()
        .then((item) => {
            item.forEach((doc) => {
                doc.ref.delete();
                res.json({ message: `like ${doc.id} deleted successfully` });
            });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });
}

//get liked course info from Database
exports.getLikedCourses = (req, res) => {
    db
        .collection('favorites')
        .get()
        .then(data => {
            let courses = [];
            data.forEach((doc) => {
                courses.push({
                    favoritesCollectionId: doc.id,
                    courseId: doc.data().courseId,
                    userEmail: doc.data().userEmail,
                });
            });
            return res.json(courses);
        })
        .catch((err) => console.error(err));
}