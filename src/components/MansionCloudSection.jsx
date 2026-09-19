import React from 'react';
import cloudVideo from '../../videos/clouds_over_mansion.mp4';
import './MansionCloudSection.css';

export default function MansionCloudSection() {
  return (
    <section
      className="mansion-cloud-section"
      aria-label="Chettinad Architectural Heritage in Motion"
    >
      {/* Background Video */}
      <div className="mansion-video-wrap">
        <video
          src={cloudVideo}
          autoPlay
          loop
          muted
          playsInline
          className="mansion-single-video"
        />

        {/* Ambient Gradient Scrim for Contrast & Seamless Section Blending */}
        <div className="mansion-video-scrim" aria-hidden="true" />
      </div>
    </section>
  );
}
