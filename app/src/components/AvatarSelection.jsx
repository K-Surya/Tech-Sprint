import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import dog from '../assets/dog.png';
import fox from '../assets/fox.png';
import owl from '../assets/owl.png';
import rabbit from '../assets/rabbit.png';
import turtle from '../assets/turtle.png';

const avatars = [
  { id: 'dog', src: dog, label: 'Loyal Dog' },
  { id: 'fox', src: fox, label: 'Clever Fox' },
  { id: 'owl', src: owl, label: 'Wise Owl' },
  { id: 'rabbit', src: rabbit, label: 'Quick Rabbit' },
  { id: 'turtle', src: turtle, label: 'Steady Turtle' }
];

const AvatarSelection = ({ onSelect, initialAvatar = null, isOnboarding = false }) => {
  const [selected, setSelected] = useState(initialAvatar || avatars[2].id); // Default to Owl
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onSelect(selected);
    } catch (error) {
      console.error("Selection failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="avatar-selection-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2 className="google-font" style={{ marginBottom: '1rem' }}>
        {isOnboarding ? "Choose Your Study Buddy" : "Update Your Avatar"}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Select an avatar that represents your learning style.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '1.5rem',
        maxWidth: '600px',
        margin: '0 auto 3rem auto'
      }}>
        {avatars.map((avatar) => {
          const isSelected = selected === avatar.id;
          return (
            <motion.div
              key={avatar.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(avatar.id)}
              style={{
                cursor: 'pointer',
                background: isSelected ? 'rgba(66, 133, 244, 0.1)' : 'var(--bg-secondary)',
                border: isSelected ? '2px solid var(--google-blue)' : '2px solid var(--border-color)',
                borderRadius: '24px',
                padding: '1.5rem',
                position: 'relative',
                boxShadow: isSelected ? '0 8px 16px rgba(66, 133, 244, 0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <img
                src={avatar.src}
                alt={avatar.label}
                style={{ width: '80%', height: 'auto', borderRadius: '12px' }}
              />
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isSelected ? 'var(--google-blue)' : 'var(--text-primary)',
                textAlign: 'center'
              }}>
                {avatar.label}
              </div>
              {isSelected && (
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <CheckCircle2 size={24} fill="var(--google-blue)" color="white" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        className="btn-modern btn-solid"
        onClick={handleConfirm}
        disabled={loading}
        style={{ padding: '0.8rem 3rem' }}
      >
        {loading ? 'Saving...' : (isOnboarding ? 'Get Started' : 'Save Changes')}
        {!loading && <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />}
      </button>
    </div>
  );
};

export default AvatarSelection;
export { avatars }; // Export for use in Profile display
