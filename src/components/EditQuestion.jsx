// EditQuestion.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setTitle(data.title);
        setAnswer(data.answer || '');
        setTags(data.tags?.join(', ') || '');
      }
      setLoading(false);
    };

    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from('questions')
      .update({
        title,
        answer,
        tags: tagArray,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      alert('Question updated successfully!');
      navigate('/questions'); // or '/questions-list' — wherever your list is
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Question</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Answer</label>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Tags (comma separated)</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, JavaScript, Frontend"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit">Update Question</Button>
          <Button variant="outline" type="button" onClick={() => navigate('/questions')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;