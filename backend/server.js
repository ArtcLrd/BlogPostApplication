const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();
//cors
const cors = require('cors');

app.use(cors({
  origin:process.env.FRONTEND_URL || 'http://localhost:3000', // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // if you want to send cookies or auth headers
}));

app.use(bodyParser.json());

//Checks for env variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables!');
  process.exit(1);
}



const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const JWT_SECRET = process.env.JWT_SECRET;





// Middleware to verify JWT
tokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

//Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
  const { email, password, display_name } = req.body;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name }
  });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ user_id: data.user.id, email: data.user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Blog Endpoints
app.post('/api/blogs/save-draft', tokenMiddleware, async (req, res) => {
  const { id, title, content, tags } = req.body;
  if (id) {
    const { error } = await supabase.from('blogs').update({ title, content, tags, status: 'draft', updated_at: new Date() }).eq('id', id).eq('user_id', req.user.user_id);
    if (error) return res.status(400).json({ error });
    return res.json({ message: 'Draft updated' });
  } else {
    const { data, error } = await supabase.from('blogs').insert([{ title, content, tags, status: 'draft', user_id: req.user.user_id }]).select();
    if (error) return res.status(400).json({ error });
    return res.json(data);
  }
});

app.get('/api/blogs/drafts', tokenMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select()
    .eq('user_id', req.user.user_id)
    .eq('status', 'draft');

  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.post('/api/blogs/publish', tokenMiddleware, async (req, res) => {
  const { id, title, content, tags } = req.body;
  if (id) {
    const { error } = await supabase.from('blogs').update({ title, content, tags, status: 'published', updated_at: new Date() }).eq('id', id).eq('user_id', req.user.user_id);
    if (error) return res.status(400).json({ error });
    return res.json({ message: 'Blog published' });
  } else {
    const { data, error } = await supabase.from('blogs').insert([{ title, content, tags, status: 'published', user_id: req.user.user_id }]).select();
    if (error) return res.status(400).json({ error });
    return res.json(data);
  }
});

app.get('/api/blogs', tokenMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('blogs').select().eq('user_id', req.user.user_id);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.get('/api/blogs/:id', tokenMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('blogs').select().eq('id', req.params.id).eq('user_id', req.user.user_id).single();
  if (error) return res.status(404).json({ error: 'Blog not found' });
  res.json(data);
});

app.put('/api/blogs/:id', tokenMiddleware, async (req, res) => {
  const { title, content, tags, status } = req.body;
  const { error } = await supabase
    .from('blogs')
    .update({ title, content, tags, status, updated_at: new Date() })
    .eq('id', req.params.id)
    .eq('user_id', req.user.user_id);

  if (error) return res.status(400).json({ error });
  res.json({ message: 'Blog updated' });
});


app.delete('/api/blogs/:id', tokenMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const blogId = req.params.id;

  const error  = await supabase
    .from('blogs')
    .delete()
    .eq('id', blogId)
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Blog deleted' });
});



app.get('/api/public/blogs', async (req, res) => {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
  id,
  title,
  created_at,
  tags,
  status
`)

    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error });

  const blogs = data.map((blog) => ({
    ...blog,
    author_name: blog.users?.display_name || 'Unknown',
  }));

  res.json(blogs);
});


app.get('/api/public/blogs/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, content, tags, created_at')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  res.json(data);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
