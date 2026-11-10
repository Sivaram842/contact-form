import { useState } from "react";

const inputStyle =
  "w-full bg-[#111412] border border-[#303631] px-4 py-3.5 text-sm text-[#F2F3F0] placeholder:text-[#737A73] outline-none transition-all duration-200 focus:border-[#A0AD70] focus:ring-1 focus:ring-[#A0AD70]/30 rounded-sm";

const labelStyle =
  "block text-[11px] font-medium tracking-[0.16em] uppercase text-[#A8ACA8] mb-2.5";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    enquiry: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed.");
      }

      if (!result.emailSent) {
        setStatus({
          type: "warning",
          message:
            "Your enquiry was saved, but email notification could not be sent. Our team will need to check it.",
        });
      } else {
        setStatus({
          type: "success",
          message: "Your enquiry has been submitted successfully!",
        });

        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          enquiry: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Form Submission Error:", error);

      setStatus({
        type: "error",
        message:
          error.message || "Unable to submit your enquiry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0E0C] text-[#F2F3F0]">
      {/* Navigation */}
      <nav className="border-b border-[#282E29]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-14 h-24 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img
              src="/Images/logo.png"
              alt="Doom Industries"
              className="h-36 w-36 object-contain"
            />
          </a>

          <div className="text-[10px] sm:text-xs tracking-[0.2em] text-[#A8ACA8] uppercase">
            Engineering / Contact
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-14 py-14 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          {/* Left Section */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-[#A0AD70]"></span>
                <span className="text-[#A0AD70] text-[11px] tracking-[0.22em] uppercase">
                  Get in touch / 001
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.055em] leading-[1.05]">
                Let's build
                <br />
                <span className="text-[#A0AD70]">what's next.</span>
              </h1>

              <p className="mt-8 text-[#A8ACA8] text-sm sm:text-base leading-7 max-w-md">
                Have a project, partnership or technical requirement in mind?
                Connect with our team and let's explore what's possible.
              </p>
            </div>

            {/* Additional Information */}
            <div className="mt-16 lg:mt-24">
              <div className="border-t border-[#303631] pt-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#777F77] mb-3">
                  Direct Enquiries
                </p>

                <a
                  href="mailto:contact@doomindustries.com"
                  className="text-sm sm:text-base hover:text-[#A0AD70] transition-colors"
                >
                  contact@doomindustries.com
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#777F77] mb-2">
                    Division
                  </p>
                  <p className="text-sm">Engineering</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#777F77] mb-2">
                    Response
                  </p>
                  <p className="text-sm">Business Enquiries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="lg:col-span-7">
            <div className="border border-[#303631] bg-[#101411] p-5 sm:p-8 lg:p-10">
              <div className="flex items-center justify-between mb-9 pb-6 border-b border-[#303631]">
                <div>
                  <p className="text-sm font-medium tracking-wide">
                    Submit an Enquiry
                  </p>
                  <p className="text-xs text-[#777F77] mt-2">
                    Fields marked with * are required.
                  </p>
                </div>

                <span className="text-[10px] tracking-widest text-[#A0AD70] border border-[#566044] px-3 py-2">
                  FORM / 01
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* Company and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Organization</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company / Organization"
                      value={formData.company}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </div>
                </div>

                {/* Enquiry Type */}
                <div>
                  <label className={labelStyle}>Enquiry Type *</label>

                  <select
                    name="enquiry"
                    value={formData.enquiry}
                    onChange={handleChange}
                    className={`${inputStyle} appearance-none`}
                    required
                  >
                    <option value="" disabled>
                      Select an enquiry type
                    </option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Business Partnership">
                      Business Partnership
                    </option>
                    <option value="Technical Collaboration">
                      Technical Collaboration
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className={labelStyle}>
                    Project Details / Message *
                  </label>

                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us about your requirements, project or enquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputStyle} resize-y min-h-[130px]`}
                    required
                  />
                </div>

                {/* Submit */}
                <div className="pt-3">
                  {status.message && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`mb-5 p-4 text-sm border ${
                        status.type === "success"
                          ? "border-green-700 bg-green-950/30 text-green-400"
                          : status.type === "warning"
                            ? "border-yellow-700 bg-yellow-950/30 text-yellow-400"
                            : "border-red-700 bg-red-950/30 text-red-400"
                      }`}
                    >
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-8 bg-[#A0AD70] text-[#101411] px-8 py-4 text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#B5C18A] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Enquiry"}

                    {!isSubmitting && <span className="text-lg">↗</span>}
                  </button>

                  <p className="text-[11px] text-[#777F77] mt-5 leading-5">
                    By submitting this form, you agree to be contacted regarding
                    your enquiry.
                  </p>
                </div>
              </form>
            </div>

            {/* Bottom Note */}
            <div className="flex justify-between items-center mt-6 text-[9px] sm:text-[10px] tracking-[0.16em] text-[#626A63] uppercase">
              <span>DOOM INDUSTRIES</span>
              <span>Engineering Beyond Limits</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
