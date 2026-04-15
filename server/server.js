require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Articles about sustainability for reference
const sustainabilityArticles = [
  {
    company: 'Microsoft',
    title: 'Microsoft Environmental Sustainability',
    url: 'https://www.microsoft.com/en-us/corporate-responsibility/sustainability',
    summary: `Microsoft has committed to becoming carbon negative by 2030 and removing 
    all historical carbon emissions by 2050. They invest in renewable energy, 
    water replenishment programs, and zero-waste initiatives. Microsoft AI for Earth 
    uses AI to accelerate solutions for climate, agriculture, biodiversity, and water challenges.`
  },
  {
    company: 'Amazon',
    title: 'Amazon Sustainability Initiatives',
    url: 'https://aws.amazon.com/about-aws/sustainability/',
    summary: `Amazon has committed to The Climate Pledge, aiming for net-zero carbon by 2040. 
    AWS infrastructure is designed to be highly efficient, and Amazon is investing in 
    renewable energy projects worldwide. They are working toward powering operations with 
    100% renewable energy and have ordered 100,000 electric delivery vehicles.`
  },
  {
    company: 'Google',
    title: 'Google Sustainability Efforts',
    url: 'https://sustainability.google/',
    summary: `Google has operated as carbon neutral since 2007 and aims to run on 
    carbon-free energy 24/7 by 2030. They use AI to optimize data center cooling, 
    reducing energy use by 40%. Google also invests in circular economy initiatives 
    and sustainable supply chain practices.`
  },
  {
    company: 'Meta',
    title: 'Meta Sustainability',
    url: 'https://sustainability.fb.com/',
    summary: `Meta has achieved net-zero emissions for global operations and is working 
    toward net-zero value chain emissions by 2030. They have committed to 100% renewable 
    energy for global operations and are investing in water restoration and forest protection programs.`
  }
];

// Summarize a specific article using Gemini
app.post('/api/summarize', async (req, res) => {
  const { articleText, company } = req.body;

  if (!articleText) {
    return res.status(400).json({ error: 'Article text is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an environmental sustainability analyst. 
    Analyze and summarize the following article about ${company || 'a tech company'}'s 
    sustainability initiatives. 
    
    Provide:
    1. A concise summary (2-3 sentences)
    2. Key sustainability initiatives mentioned
    3. Environmental impact assessment
    4. Future goals and commitments
    
    Article content:
    ${articleText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ summary: text, company });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Summarize all articles at once
app.post('/api/summarize-all', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const articlesText = sustainabilityArticles
      .map(a => `${a.company}: ${a.summary}`)
      .join('\n\n');

    const prompt = `You are an environmental sustainability analyst specializing in tech industry practices.
    
    Based on the following summaries of major tech companies' sustainability initiatives, provide:
    
    1. OVERALL ANALYSIS: A comprehensive 2-3 paragraph analysis of the tech industry's approach to sustainability
    2. COMMON THEMES: Key themes and patterns across all companies
    3. BEST PRACTICES: Which company appears to be leading in sustainability and why
    4. GAPS & CHALLENGES: What challenges remain in the tech industry's sustainability efforts
    5. IMPACT ASSESSMENT: The overall environmental impact of these initiatives
    
    Company summaries:
    ${articlesText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      analysis: text,
      articles: sustainabilityArticles
    });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all articles
app.get('/api/articles', (req, res) => {
  res.json(sustainabilityArticles);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));