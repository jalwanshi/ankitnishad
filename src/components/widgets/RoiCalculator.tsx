"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sliders, DollarSign, Users, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(500);
  const [industry, setIndustry] = useState("Services");
  const [currency, setCurrency] = useState("₹");

  // Output calculations
  const [annualLeakHours, setAnnualLeakHours] = useState(0);
  const [annualLeakCost, setAnnualLeakCost] = useState(0);
  const [potentialSavingsCost, setPotentialSavingsCost] = useState(0);
  const [paybackMonths, setPaybackMonths] = useState("1.5 Months");

  const industries = [
    { name: "Services", potential: 0.70 },
    { name: "Finance & Accounting", potential: 0.80 },
    { name: "FMCG & Retail", potential: 0.75 },
    { name: "Manufacturing", potential: 0.60 },
    { name: "Healthcare", potential: 0.65 }
  ];

  useEffect(() => {
    const selectedInd = industries.find(i => i.name === industry) || industries[0];
    const hoursYear = teamSize * hoursPerWeek * 52;
    const costYear = hoursYear * hourlyRate;
    const savingsYear = Math.round(costYear * selectedInd.potential);
    
    setAnnualLeakHours(hoursYear);
    setAnnualLeakCost(costYear);
    setPotentialSavingsCost(savingsYear);

    // Payback calculation simulation
    if (savingsYear > 1000000) {
      setPaybackMonths("Under 1 Month");
    } else if (savingsYear > 500000) {
      setPaybackMonths("1 to 1.5 Months");
    } else {
      setPaybackMonths("Under 2 Months");
    }
  }, [teamSize, hoursPerWeek, hourlyRate, industry]);

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  // Generate URL for pre-filled contact form
  const getPreFilledContactUrl = () => {
    const challengeText = encodeURIComponent(
      `Based on the ROI Calculator: We have a team of ${teamSize} people in the ${industry} industry wasting approximately ${hoursPerWeek} hours/week per person on repetitive manual processes. We are looking to recover our annual leak of ${currency}${formatNumber(annualLeakCost)}.`
    );
    return `/contact?service=automation&challenge=${challengeText}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-border-grey bg-white rounded-2xl p-6 md:p-12 shadow-xs max-w-5xl mx-auto space-y-10"
    >
      {/* Title */}
      <div className="border-b border-border-grey/75 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-accent-gold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Calculator
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-light text-primary-black uppercase mt-1 tracking-wide">
            Process Automation ROI Estimator
          </h3>
          <p className="text-xs text-muted-grey font-light mt-0.5">
            Estimate the cost leak in your manual workflows and see your potential savings.
          </p>
        </div>
        <div className="flex bg-soft-bg p-1 border border-border-grey rounded-lg">
          <button 
            onClick={() => setCurrency("₹")} 
            className={`px-3 py-1 text-xs font-semibold rounded ${currency === "₹" ? "bg-primary-black text-white" : "text-dark-grey"}`}
          >
            INR (₹)
          </button>
          <button 
            onClick={() => { setCurrency("$"); if (hourlyRate === 500) setHourlyRate(25); }} 
            className={`px-3 py-1 text-xs font-semibold rounded ${currency === "$" ? "bg-primary-black text-white" : "text-dark-grey"}`}
          >
            USD ($)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 space-y-8 bg-soft-bg/35 p-6 rounded-xl border border-border-grey/50">
          
          {/* Industry dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-muted-grey font-bold flex justify-between">
              <span>Business Industry</span>
              <span className="text-accent-gold">
                {(industries.find(i => i.name === industry)?.potential || 0.7) * 100}% Automation Index
              </span>
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-white border border-border-grey text-xs uppercase tracking-widest py-3 px-4 text-primary-black focus:outline-none focus:border-primary-black transition-colors rounded-lg font-medium cursor-pointer"
            >
              {industries.map(ind => (
                <option key={ind.name} value={ind.name}>{ind.name}</option>
              ))}
            </select>
          </div>

          {/* Slider: Team Size */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider">
              <span className="font-semibold text-primary-black flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-grey" /> Team Size
              </span>
              <span className="font-bold text-primary-black bg-white px-2 py-0.5 border border-border-grey rounded">
                {teamSize} Employees
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full h-1 bg-border-grey rounded-lg appearance-none cursor-pointer accent-primary-black"
            />
          </div>

          {/* Slider: Hours Per Week */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider">
              <span className="font-semibold text-primary-black flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-grey" /> Manual Hours / Week per employee
              </span>
              <span className="font-bold text-primary-black bg-white px-2 py-0.5 border border-border-grey rounded">
                {hoursPerWeek} Hours
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full h-1 bg-border-grey rounded-lg appearance-none cursor-pointer accent-primary-black"
            />
          </div>

          {/* Input/Slider: Hourly Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-wider">
              <span className="font-semibold text-primary-black flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-muted-grey" /> Hourly Employee Cost
              </span>
              <span className="font-bold text-primary-black bg-white px-2 py-0.5 border border-border-grey rounded">
                {currency}{formatNumber(hourlyRate)} / hr
              </span>
            </div>
            <input 
              type="range" 
              min={currency === "₹" ? "100" : "5"} 
              max={currency === "₹" ? "5000" : "250"}
              step={currency === "₹" ? "50" : "1"}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full h-1 bg-border-grey rounded-lg appearance-none cursor-pointer accent-primary-black"
            />
          </div>

        </div>

        {/* Right Outputs Column */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between h-full min-h-[380px]">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Output: Annual Wasted Hours */}
            <div className="border border-border-grey bg-white p-5 rounded-xl">
              <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-1">
                Hours Wasted / Year
              </span>
              <span className="font-display text-2xl md:text-3xl font-light text-primary-black block">
                {formatNumber(annualLeakHours)} hrs
              </span>
              <span className="text-[8px] uppercase font-semibold text-muted-grey mt-2 block">
                lost in manual loops
              </span>
            </div>

            {/* Output: Current Cost Leak */}
            <div className="border border-border-grey bg-white p-5 rounded-xl border-dashed">
              <span className="text-[9px] uppercase tracking-widest text-red-500 block mb-1">
                Current Operational Leak
              </span>
              <span className="font-display text-2xl md:text-3xl font-normal text-red-500 block">
                {currency}{formatNumber(annualLeakCost)}
              </span>
              <span className="text-[8px] uppercase font-semibold text-muted-grey mt-2 block">
                annual process cost
              </span>
            </div>

            {/* Output: Recoverable Savings */}
            <div className="border border-primary-black bg-soft-bg p-5 rounded-xl sm:col-span-2">
              <span className="text-[9px] uppercase tracking-widest text-[#c89f7c] font-bold block mb-1">
                Potential Recoverable Savings
              </span>
              <span className="font-display text-3xl md:text-4xl font-light text-primary-black block mb-2">
                {currency}{formatNumber(potentialSavingsCost)} <span className="text-xs font-semibold text-muted-grey uppercase tracking-normal">/ year</span>
              </span>
              <span className="text-[8px] uppercase font-semibold text-primary-black bg-white px-2 py-0.5 border border-border-grey rounded-full inline-block">
                at {(industries.find(i => i.name === industry)?.potential || 0.7) * 100}% automation efficiency
              </span>
            </div>

          </div>

          {/* Payback period and CTA */}
          <div className="space-y-4 pt-4 border-t border-border-grey">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-muted-grey">
              <span>Estimated ROI Break-Even:</span>
              <span className="font-bold text-primary-black">{paybackMonths}</span>
            </div>
            
            <Link
              href={getPreFilledContactUrl()}
              className="group w-full flex items-center justify-center gap-2 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black py-4 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-bold rounded-xl cursor-pointer"
            >
              Book Free Process Audit & Claim Savings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
