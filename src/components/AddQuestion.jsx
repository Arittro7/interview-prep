import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const AddQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load existing question if editing
  useEffect(() => {
    if (id) {
      const fetchQuestion = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setMessage('Error loading question: ' + error.message);
        } else if (data) {
          setTitle(data.title);
          setAnswer(data.answer);
          setTags(data.tags?.join(', ') || '');
          setIsEditMode(true);
        }
        setLoading(false);
      };

      fetchQuestion();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !answer.trim()) {
      setMessage('Title and Answer are required!');
      return;
    }

    setLoading(true);
    setMessage('');

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = { title, answer, tags: tagsArray };

    let result;
    if (isEditMode) {
      // Update
      result = await supabase
        .from('questions')
        .update(payload)
        .eq('id', id);
    } else {
      // Insert new
      result = await supabase
        .from('questions')
        .insert([payload]);
    }

    const { error } = result;

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage('Error: ' + (error.message || 'Operation failed'));
    } else {
      setMessage(isEditMode ? 'Question updated successfully!' : 'Question added successfully!');
      // Optional: clear form after success
      if (!isEditMode) {
        setTitle('');
        setAnswer('');
        setTags('');
      }
      // Redirect back to list after 1.5s
      setTimeout(() => {
        navigate('/questions');
      }, 1500);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditMode ? 'Edit Question' : 'Add New Question'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                placeholder="Enter question title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <Textarea
                placeholder="Write the full explanation here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[160px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tags (comma-separated)
              </label>
              <Input
                placeholder="e.g. React, Hooks, Frontend, JavaScript"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update Question'
                  : 'Add Question'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/questions')}
              >
                Cancel
              </Button>
            </div>

            {message && (
              <p
                className={`text-center mt-4 ${
                  message.includes('Error') ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestion;