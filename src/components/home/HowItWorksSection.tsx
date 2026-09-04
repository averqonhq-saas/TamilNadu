export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "You Speak",
      description:
        "Tell us about a real problem you believe technology can solve. You don't need to know how to build it — just describe what's difficult.",
      accent: "#e85d26",
    },
    {
      number: "02",
      title: "We Listen",
      description:
        "We review, organize and identify recurring problems and high-impact ideas from across all 38 districts of Tamil Nadu.",
      accent: "#3b82f6",
    },
    {
      number: "03",
      title: "Tamil Nadu Decides",
      description:
        "After the collection phase, shortlisted ideas go to a public vote. Everyone in Tamil Nadu gets a say in what gets built first.",
      accent: "#22c55e",
    },
  ];

  return (
    <section className="section bg-[#f8f7f4]" aria-labelledby="how-it-works-heading">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <div className="section-eyebrow">
            <span className="w-4 h-px bg-[#e85d26]" />
            The Process
          </div>
          <h2 className="section-title" id="how-it-works-heading">
            We don't want to guess what Tamil Nadu needs.
          </h2>
          <p className="section-subtitle mt-4">
            We want to hear it directly from the people who live here.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#e2e8f0] to-transparent z-0 -translate-y-0.5" />
              )}

              <div className="relative z-10">
                {/* Step number */}
                <div
                  className="font-jakarta font-black text-[48px] md:text-[64px] leading-none mb-4 select-none"
                  style={{
                    color: step.accent,
                    opacity: 0.12,
                    fontWeight: 900,
                  }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                <div
                  className="font-jakarta font-bold text-[13px] mb-3 tracking-widest uppercase"
                  style={{ color: step.accent }}
                >
                  {step.number} —
                </div>
                <h3 className="font-jakarta font-bold text-[22px] text-[#0a0e1a] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#64748b] leading-relaxed text-[15px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Strong statement */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#e85d26]" />
            <p className="font-jakarta font-bold text-[22px] sm:text-[28px] lg:text-[36px] text-[#0a0e1a] tracking-tight">
              The winning idea gets built.
            </p>
            <p className="text-[#64748b] text-[16px] max-w-md text-center">
              Not as a prototype. Not as a concept. As a real working product tested by real people.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
