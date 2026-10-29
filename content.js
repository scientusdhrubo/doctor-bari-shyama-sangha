/*
  EDITABLE SITE CONTENT
  Replace placeholder image paths with approved organizational photographs.
  Keep paths relative to index.html. Use webp/jpg images compressed for mobile.
*/
window.SITE_CONTENT = {
  announcement: { enabled: false, bn: "", en: "" },
  organization: {
    address: "Dakshin Kanchana, Satkania, Chattogram, Bangladesh",
    phone: "",                 // Example format: +8801XXXXXXXXX (verified number only)
    email: "",                 // Verified official email only
    facebook: "",              // Full public Facebook Page URL only
    maps: ""                   // Optional verified Google Maps directions URL
  },
  catalogs: [
    // Example to add a real catalog:
    // { year: "2026", title: {bn:"২০২৬ সালের প্রতিমা",en:"2026 Idol"}, description:{bn:"বার্ষিক প্রতিমার সংকলন",en:"Annual idol collection"}, image:"assets/images/catalogs/2026.webp", pdf:"assets/images/catalogs/2026.pdf" }
  ],
  gallery: [
    { id:"idol-2026", category:"idols", image:"assets/images/gallery/idol-artistry.webp", alt:{bn:"প্রতিমাশিল্পের ছবি",en:"Idol artistry photograph"}, caption:{bn:"প্রতিমাশিল্প ও সাজসজ্জা",en:"Idol artistry and decoration"}, year:"2026" },
    { id:"venue-2026", category:"venue", image:"assets/images/gallery/puja-venue.webp", alt:{bn:"পূজামণ্ডপের ছবি",en:"Puja venue photograph"}, caption:{bn:"পূজামণ্ডপ",en:"Puja venue"}, year:"2026" },
    { id:"moment-2026", category:"moments", image:"assets/images/gallery/puja-moments.webp", alt:{bn:"পূজার মুহূর্ত",en:"Puja moment"}, caption:{bn:"পূজার মুহূর্ত",en:"Puja moments"}, year:"2026" },
    { id:"culture-2026", category:"culture", image:"assets/images/gallery/cultural-event.webp", alt:{bn:"সাংস্কৃতিক আয়োজন",en:"Cultural event"}, caption:{bn:"সাংস্কৃতিক আয়োজন",en:"Cultural event"}, year:"2026" },
    { id:"memory-2026", category:"memories", image:"assets/images/gallery/memory.webp", alt:{bn:"উৎসবের স্মৃতি",en:"Festival memory"}, caption:{bn:"উৎসবের স্মৃতি",en:"Festival memory"}, year:"2026" },
    { id:"about-2026", category:"moments", image:"assets/images/gallery/about.webp", alt:{bn:"সংগঠনের আয়োজন",en:"Organization celebration"}, caption:{bn:"আমাদের আয়োজন",en:"Our celebration"}, year:"2026" }
  ],
  events: [
    // Only publish events after the date, time, venue and details are confirmed.
    // { id:"shyama-puja-2026", status:"past", date:"2026-11-08", time:"18:00", location:{bn:"দক্ষিণ কাঞ্চনা",en:"Dakshin Kanchana"}, title:{bn:"শ্যামা পূজা",en:"Shyama Puja"}, description:{bn:"অনুষ্ঠানের সংক্ষিপ্ত বিবরণ।",en:"A short description of the event."}, poster:"assets/images/events/shyama-puja-2026.webp" }
  ]
};