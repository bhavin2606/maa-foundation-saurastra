import type { ReactNode } from "react";
import { Bird, BookOpen, Landmark, Leaf, PawPrint, ScrollText } from "lucide-react";

export type Initiative = {
  id: string;
  title: string;
  subtitle: string;
  short: string;
  description: string;
  bullets: string[];
  icon: ReactNode;
  image: string;
};

export const initiatives: Initiative[] = [
  {
    id: "shwan-seva",
    title: "Shwan Seva",
    subtitle: "रोज़ाना श्वान सेवा",
    short: "श्वान को गुड़ व तेल लगाकर रोटियाँ दी जाती हैं।",
    description:
      "Daily shwan seva is a small act with a big heart. हम रोज़ जरूरतमंद श्वानों को गुड़ व तेल लगाकर रोटियाँ देते हैं—ताकि सेवा भी हो और संवेदना भी बढ़े।",
    bullets: [
      "रोज़ाना भोजन/देखभाल की व्यवस्था",
      "सुरक्षित, clean feeding spots",
      "Community awareness for kindness",
    ],
    icon: <PawPrint size={22} />,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "education",
    title: "Shiksha Support",
    subtitle: "बच्चों की पढ़ाई में सहायता",
    short: "पढ़ाई करते बच्चों को पढ़ाई के लिए मदद की जाती है।",
    description:
      "Education changes destiny. हम बच्चों की पढ़ाई में मदद करते हैं—guidance, study support, और जहाँ संभव हो learning resources के साथ।",
    bullets: [
      "Study support & mentoring",
      "Basic learning resources",
      "Motivation + discipline building",
    ],
    icon: <BookOpen size={22} />,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "temple-restoration",
    title: "Mandir Jiर्णोद्धार",
    subtitle: "जर्जर मंदिरों का जीर्णोद्धार",
    short: "छोटी-छोटी पुरानी जर्जर मंदिरों का जीर्णोद्धार किया जाता है।",
    description:
      "Sanatan heritage is our identity. हम पुरानी, जर्जर हो चुकी छोटी-छोटी मंदिरों का जीर्णोद्धार करते हैं—respectfully, with care, और local devotees के सहयोग से।",
    bullets: [
      "Basic repair + cleanliness drives",
      "Community seva participation",
      "Preserving local dharmik heritage",
    ],
    icon: <Landmark size={22} />,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "birds",
    title: "Dana-Pani",
    subtitle: "पक्षियों के लिए दाना-पानी",
    short: "पक्षियों के लिए दाने और पानी की व्यवस्था की जाती है।",
    description:
      "In summers, a drop matters. हम पक्षियों के लिए दाना-पानी की व्यवस्था करते हैं—simple, regular, and humane care for nature around us।",
    bullets: [
      "Water bowls + नियमित refill",
      "Seasonal grain support",
      "Awareness to protect birds",
    ],
    icon: <Bird size={22} />,
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "ayurvedic-trees",
    title: "Ayurvedic Tree Plantation",
    subtitle: "आयुर्वेदिक वृक्षारोपण",
    short: "जहाँ देखभाल हो सके, वहाँ आयुर्वेदिक पेड़ लगाए जाते हैं।",
    description:
      "Planting is easy—care is the real work. हम ऐसी जगह आयुर्वेदिक पेड़ लगाते हैं जहाँ देखभाल possible हो, ताकि हर पौधा सच में पेड़ बने।",
    bullets: [
      "Plant where care is possible",
      "Native + ayurvedic species focus",
      "Regular watering & protection",
    ],
    icon: <Leaf size={22} />,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "sanatan-katha",
    title: "Sanatan Katha",
    subtitle: "सनातन धर्म कथा आयोजन",
    short: "सनातन धर्म की भव्य कथा का आयोजन किया जाता है।",
    description:
      "Katha is संस्कार in action. हम सनातन धर्म की भव्य कथा का आयोजन करते हैं—जहाँ bhakti, values, and community एक साथ जुड़ते हैं।",
    bullets: [
      "Katha + satsang आयोजन",
      "Seva-based community gathering",
      "Sanskar for all ages",
    ],
    icon: <ScrollText size={22} />,
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1600&q=80",
  },
];

export function getInitiativeById(id: string) {
  return initiatives.find((i) => i.id === id);
}
