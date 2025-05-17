import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Chatbot.css";

const faq = {
  "ELSOC": {
    intro: "Explore the dynamic world of the Electronics Society!",
    questions: [
      { q: "What is ELSOC?", a: "ELSOC is the official student-run society of the ECE department at BMSCE, organizing tech events, workshops, and seminars." },
      { q: "Who can join ELSOC?", a: "Any ECE student at BMSCE passionate about electronics, innovation, and leadership can join ELSOC." },
      { q: "What events does ELSOC organize?", a: "From Hackathons and Circuit Challenges to Industrial Talks and TechFests, ELSOC covers it all!" },
      { q: "How to stay updated with ELSOC events?", a: "Follow our Instagram handle @bmsce_elsoc and check the ELSOC section on the ECE website!" },
      { q: "Does ELSOC collaborate with industry?", a: "Yes! We collaborate with reputed companies to bring real-world insights to students." }
    ]
  },
  "ECE Department": {
    intro: "Your gateway to the Electronics & Communication Engineering Department!",
    questions: [
      { q: "What does the ECE Department offer?", a: "We offer cutting-edge curriculum, top-notch faculty, and extensive research opportunities." },
      { q: "Are there research opportunities for students?", a: "Absolutely! Students can participate in funded projects, publish papers, and work in state-of-the-art labs." },
      { q: "Is ECE good for placements?", a: "Yes! Our students get placed in companies like Qualcomm, Texas Instruments, Intel, and many startups." },
      { q: "How to connect with faculty?", a: "Visit the 'Staff' section on our website for faculty emails and areas of expertise." }
    ]
  },
  "Alumni": {
    intro: "Discover the legacy of our proud ECE alumni!",
    questions: [
      { q: "Where are our alumni now?", a: "Our alumni shine globally at companies like Google, Microsoft, Intel, and in academia too!" },
      { q: "Can I connect with alumni?", a: "Yes! Head to the Alumni Connect page on our website and explore LinkedIn profiles directly." },
      { q: "Any notable alumni achievements?", a: "Absolutely! From Shark Tank India appearances to global research contributions, ECE alumni inspire us daily." }
    ]
  },
  "Contact Us": {
    intro: "Need to get in touch? Here are our contact details.",
    questions: [
      { q: "General Email", a: "eceedepartment@bmsce.ac.in" },
      { q: "Phone Number", a: "+91-80-26622130 Ext: 246" },
      { q: "Location", a: "Department of ECE, BMS College of Engineering, Basavanagudi, Bengaluru" }
    ]
  }
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi there! What do you want to know about?" }]);
  const bodyRef = useRef();

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setStage("questions");
    setMessages([
      { from: "bot", text: `You selected "${category}". ${faq[category].intro}` }
    ]);
  };

  const handleQuestionSelect = qa => {
    setMessages(m => [...m, { from: "user", text: qa.q }, { from: "bot", text: qa.a }]);
  };

  const goBack = () => {
    setStage("categories");
    setSelectedCategory(null);
    setMessages([{ from: "bot", text: "Hi there! What do you want to know about?" }]);
  };

  return createPortal(
    <>
      <div className="chatbot-toggle" onClick={() => setOpen(o => !o)}>
        <i className="fas fa-robot"></i>
      </div>

      {open && (
        <div className="chatbot-container">
          <div className="chat-header">
            ELSOC Chatbot
            <span className="chat-close" onClick={() => setOpen(false)}>×</span>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.from === "bot" ? "bot-message" : "user-message"}>
                {m.text}
              </div>
            ))}

            <div className="chat-options">
              {stage === "categories" && Object.keys(faq).map(cat => (
                <button key={cat} className="chat-option-button" onClick={() => handleCategorySelect(cat)}>
                  {cat}
                </button>
              ))}

              {stage === "questions" && selectedCategory && faq[selectedCategory].questions.map((qa, i) => (
                <button key={i} className="chat-option-button" onClick={() => handleQuestionSelect(qa)}>
                  {qa.q}
                </button>
              ))}
            </div>
          </div>

          {stage === "questions" && (
            <div className="chat-footer">
              <button className="chat-back-button" onClick={goBack}>← Back</button>
            </div>
          )}
        </div>
      )}
    </>,
    document.body
  );
}
