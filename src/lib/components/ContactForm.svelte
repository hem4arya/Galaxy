<script lang="ts">
  import { supabase } from '$lib/supabaseClient';

  let name = $state('');
  let email = $state('');
  let subject = $state('');
  let message = $state('');
  let isSubmitting = $state(false);
  let showSuccess = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!name || !email || !message) {
      error = 'Please fill in all required fields';
      return;
    }

    isSubmitting = true;
    error = '';

    try {
      // Save message to Supabase messages table
      const { error: submitError } = await supabase
        .from('messages')
        .insert({
          sender_name: name,
          sender_email: email,
          body: message,
          message_type: subject || 'contact'
        });

      if (submitError) {
        error = 'Failed to send message. Please try again.';
        console.error('Error submitting message:', submitError);
      } else {
        showSuccess = true;
        name = '';
        email = '';
        subject = '';
        message = '';
        
        setTimeout(() => {
          showSuccess = false;
        }, 5000);
      }
    } catch (err) {
      error = 'Failed to send message. Please try again.';
      console.error('Error:', err);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="contact-form">
  <h2>Get In Touch</h2>
  
  {#if showSuccess}
    <div class="success-message">
      ✨ Message sent successfully! I'll get back to you soon.
    </div>
  {/if}

  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}

  <form onsubmit={handleSubmit}>
    <div class="form-group">
      <label for="name">Name *</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        required
        disabled={isSubmitting}
      />
    </div>

    <div class="form-group">
      <label for="email">Email *</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        disabled={isSubmitting}
      />
    </div>

    <div class="form-group">
      <label for="subject">Subject</label>
      <input
        id="subject"
        type="text"
        bind:value={subject}
        disabled={isSubmitting}
      />
    </div>

    <div class="form-group">
      <label for="message">Message *</label>
      <textarea
        id="message"
        bind:value={message}
        rows="5"
        required
        disabled={isSubmitting}
      ></textarea>
    </div>

    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Sending...' : 'Send Message'}
    </button>
  </form>
</div>

<style>
  .contact-form {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 30px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    max-width: 500px;
    margin: 0 auto;
  }

  h2 {
    color: white;
    margin: 0 0 25px 0;
    text-align: center;
    font-size: 28px;
  }

  .success-message {
    background: rgba(100, 200, 100, 0.2);
    border: 2px solid rgba(100, 200, 100, 0.5);
    color: #90ee90;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
  }

  .error-message {
    background: rgba(255, 100, 100, 0.2);
    border: 2px solid rgba(255, 100, 100, 0.5);
    color: #ff6b6b;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: rgba(147, 112, 219, 0.5);
    background: rgba(255, 255, 255, 0.08);
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  button {
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
</style>