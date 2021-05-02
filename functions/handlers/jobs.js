const { db } = require('../util/admin');


//like jobs 
exports.likeJobs = (req, res) => {
    const likeJob = {
        jobLink: req.body.jobLink,
        jobTitle: req.body.jobTitle,
        userEmail: req.body.userEmail,
    };
    db
        .collection('favJobs')
        .add(likeJob)
        .then((doc) => {
            res.json({ message: `like ${doc.id} added successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });

}

//unlike jobs 
exports.unLikeJobs = (req, res) => {

    var favJob = db.collection('favJobs').where('jobTitle', '==', req.body.jobName);

    favJob
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