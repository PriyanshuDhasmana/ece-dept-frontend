import React from "react";
import "./Home.css";
import campusVideo from "../media/ECE Department.mp4";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const goToStories = () => {
    navigate("/stories"); // 👈 define goToStories function
  };

  return (
    <div className="home">
      <div className="video-container">
        <video className="background-video" autoPlay muted loop playsInline>
          <source src={campusVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="view-stories-button">
          <button onClick={goToStories}>View Stories</button>
        </div>
      </div>

      <div className="particle-background" />

      <div className="content-wrapper">
        {/* 🔷 About Section */}
        <section className="split-section">
          <div className="split-image" />
          <div className="split-content">
            <h1 className="section-title">About Department</h1>
            <p className="section-text">
              The Department of Electronics and Communication Engineering has a
              strong legacy of excellence in education, research, and industry
              collaboration. It offers undergraduate, postgraduate, and research
              programs under the Quality Improvement Program (QIP) of the
              Government of India.
            </p>
            <br />
            <p className="section-text">
              With a curriculum rooted in analytical and technological
              foundations, the department emphasizes outcome-based education,
              industry internships, and global exposure. Faculty members
              actively engage in cutting-edge research, often in partnership
              with leading industries and research institutions. Students are
              encouraged to participate in projects, skill development programs,
              and national/international competitions to enhance their industry
              readiness.
            </p>
          </div>
        </section>

        {/* 🎯 Vision & Mission */}
        <div className="vision-mission-container">
          <section className="vision">
            <h1 className="section-title">Vision</h1>
            <p className="section-text">
              To emerge as a center of academic excellence in electronics,
              communication and related domains through knowledge acquisition,
              knowledge dissemination and knowledge generation meeting global
              needs and standards.
            </p>
          </section>

          <section className="mission">
            <h1 className="section-title">Mission</h1>
            <p className="section-text">
              Imparting quality education through state-of-the-art curriculum,
              conducive learning environment and research with scope for
              continuous improvement leading to overall professional success.
            </p>
          </section>
        </div>

        {/* 👩‍🏫 HOD Section */}
        <section className="hod-card-section">
          <div className="hod-card">
            <img
              src="/media/HOD-131514.jpeg"
              alt="Dr. K. P. Lakshmi"
              className="hod-card-photo"
            />
            <div className="hod-card-info">
              <h2 className="hod-card-name">Dr. K. P. Lakshmi</h2>
              <p className="hod-card-title">Professor and Head</p>
              <p className="hod-card-dept">
                Department of Electronics and Communication Engineering
              </p>
            </div>
          </div>
        </section>

        <section className="ieee-section">
          <h2>OUR IEEE CHAPTERS</h2>
          <p>Empowering Innovation Through Diverse Technical Communities</p>
          <div className="ieee-logos">
            <div className="ieee-logo">
              <img src="/media/images (9).png" alt="IEEE Chapter 1" />
            </div>
            <div className="ieee-divider"></div>
            <div className="ieee-logo">
              <img src="/media/download (13).png" alt="IEEE Chapter 2" />
            </div>
            <div className="ieee-divider"></div>
            <div className="ieee-logo">
              <img src="/media/download (12).jpeg" alt="IEEE Chapter 3" />
            </div>
            <div className="ieee-divider"></div>
            <div className="ieee-logo">
              <img src="/media/download (13).jpeg" alt="IEEE Chapter 4" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
