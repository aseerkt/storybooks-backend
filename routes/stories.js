const authCheck = require('../middlewares/authCheck');
const Story = require('../models/Story');

const router = require('express').Router();

// @desc   Process add story form
// @route  POST /api/stories
router.post('/', authCheck, async (req, res) => {
  const { title, body, status } = req.body;
  if (!title || !body || !status) {
    return res
      .status(400)
      .json({ success: false, error: 'Fields are required' });
  }
  req.body.user = req.user.id;
  try {
    let story = await Story.create(req.body);
    story = await Story.populate(story, 'user');
    console.log('Added and populated story', story);
    return res.json(story);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc   Process add story form
// @route  POST /api/stories/edit/:storyId
router.post('/edit/:storyId', authCheck, async (req, res) => {
  const { title, body, status } = req.body;
  if (!title || !body || !status) {
    return res
      .status(400)
      .json({ success: false, error: 'Fields are required' });
  }
  req.body.user = req.user.id;
  try {
    let story = await Story.findOne({ _id: req.params.storyId });
    if (story.user == req.user.id) {
      story.title = title;
      story.body = body;
      story.status = status;
      story.save();
      story = await Story.populate(story, 'user');
      console.log('Edited and populated story', story);
      return res.json(story);
    } else {
      return res
        .status(403)
        .json({ success: false, error: "Can't edit someon else's story" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Get all public stories
// @route   GET /api/stories
router.get('/', authCheck, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' }).populate('user');
    return res.json(stories);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Get logged in users stories
// @route   GET /api/stories/user/:userId
router.get('/user/:userId', authCheck, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id });
    return res.json(stories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Get single story by id
// @route   GET /api/stories/:storyId
router.get('/:storyId', authCheck, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.storyId }).populate(
      'user'
    );
    if (story.status === 'private') {
      if (story.user._id == req.user.id) {
        return res.json(story);
      } else {
        return res
          .status(403)
          .json({ success: false, error: 'You are not the right owner' });
      }
    } else {
      return res.json(story);
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc   Delete story by id
// @route  DELETE /api/stories/:storyId
router.delete('/:storyId', authCheck, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.storyId });
    if (story.user == req.user.id) {
      await story.remove();
      res.json({ success: true, msg: 'Story Deleted' });
    } else {
      return res
        .status(403)
        .json({ success: false, error: 'You are not the right owner' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
});
module.exports = router;
