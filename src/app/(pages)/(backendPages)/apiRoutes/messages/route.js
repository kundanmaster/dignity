import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Fetch all messages
export const GET = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM messages');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
};

// Insert or update a message
export const POST = async (req) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { sender_id, receiver_id, content } = await req.json();

  // Validate required fields
  if (!sender_id || !receiver_id || !content) {
    return NextResponse.json({ error: 'sender_id, receiver_id, and content are required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // Check if a conversation between the sender and receiver already exists
    const checkResult = await client.query(
      'SELECT * FROM conversations WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)',
      [sender_id, receiver_id]
    );

    let conversationId;

    if (checkResult.rows.length > 0) {
      // Use existing conversation ID
      conversationId = checkResult.rows[0].id;
    } else {
      // Create a new conversation
      const insertConversationResult = await client.query(
        'INSERT INTO conversations (sender_id, receiver_id) VALUES ($1, $2) RETURNING id',
        [sender_id, receiver_id]
      );
      conversationId = insertConversationResult.rows[0].id;
    }

    // Insert the new message
    const insertMessageResult = await client.query(
      'INSERT INTO messages (conversation_id, sender_id, receiver_id, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [conversationId, sender_id, receiver_id, content]
    );

    return NextResponse.json(insertMessageResult.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
};
