import React, { useEffect, useState } from 'react';
import './WhatsappButton.css'; // Importá tu CSS

const WhatsappButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      className={`whatsapp-icon ${visible ? 'visible' : ''}`}
      href="https://wa.me/+5493812067808?text=Hola%20buenas,%20una%20consulta."
      target="_blank"
      rel="noopener noreferrer"
      title="Hace tu consulta mediante nuestro chat de whatsapp"
    >
      <i className="bi bi-whatsapp wp-icon"></i>
    </a>
  );
};

export default WhatsappButton;
