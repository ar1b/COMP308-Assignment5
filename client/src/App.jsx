import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Spinner, Tabs, Tab } from 'react-bootstrap';

const ARTICLES = [
  {
    company: 'Microsoft',
    title: 'Microsoft Environmental Sustainability',
    url: 'https://www.microsoft.com/en-us/corporate-responsibility/sustainability',
    color: '#00a4ef',
    icon: '🪟',
    text: `Microsoft has committed to becoming carbon negative by 2030 and removing all historical carbon emissions by 2050. They invest in renewable energy, water replenishment programs, and zero-waste initiatives. Microsoft AI for Earth uses AI to accelerate solutions for climate, agriculture, biodiversity, and water challenges. They are also working on sustainable data centers powered by renewable energy sources.`
  },
  {
    company: 'Amazon',
    title: 'Amazon Sustainability Initiatives',
    url: 'https://aws.amazon.com/about-aws/sustainability/',
    color: '#ff9900',
    icon: '📦',
    text: `Amazon has committed to The Climate Pledge, aiming for net-zero carbon by 2040. AWS infrastructure is designed to be highly efficient, and Amazon is investing in renewable energy projects worldwide. They are working toward powering operations with 100% renewable energy and have ordered 100,000 electric delivery vehicles from Rivian to reduce transportation emissions significantly.`
  },
  {
    company: 'Google',
    title: 'Google Sustainability Efforts',
    url: 'https://sustainability.google/',
    color: '#34a853',
    icon: '🔍',
    text: `Google has operated as carbon neutral since 2007 and aims to run on carbon-free energy 24/7 by 2030. They use AI to optimize data center cooling, reducing energy use by 40%. Google also invests in circular economy initiatives and sustainable supply chain practices. Their moonshot goal is to operate entirely on carbon-free energy around the clock globally.`
  },
  {
    company: 'Meta',
    title: 'Meta Sustainability',
    url: 'https://sustainability.fb.com/',
    color: '#1877f2',
    icon: '📱',
    text: `Meta has achieved net-zero emissions for global operations and is working toward net-zero value chain emissions by 2030. They have committed to 100% renewable energy for global operations and are investing in water restoration and forest protection programs. Meta's data centers are among the most energy-efficient in the world with a Power Usage Effectiveness near 1.1.`
  },
];

export default function App() {
  const [allAnalysis, setAllAnalysis] = useState(null);
  const [allLoading, setAllLoading] = useState(false);
  const [individualResults, setIndividualResults] = useState({});
  const [individualLoading, setIndividualLoading] = useState({});
  const [customText, setCustomText] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customResult, setCustomResult] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeAll = async () => {
    setAllLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/summarize-all');
      setAllAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to analyze: ' + err.message);
    } finally {
      setAllLoading(false);
    }
  };

  const analyzeOne = async (article) => {
    setIndividualLoading(prev => ({ ...prev, [article.company]: true }));
    setError('');
    try {
      const { data } = await axios.post('/api/summarize', {
        articleText: article.text,
        company: article.company,
      });
      setIndividualResults(prev => ({ ...prev, [article.company]: data.summary }));
    } catch (err) {
      setError('Failed to analyze: ' + err.message);
    } finally {
      setIndividualLoading(prev => ({ ...prev, [article.company]: false }));
    }
  };

  const analyzeCustom = async (e) => {
    e.preventDefault();
    setCustomLoading(true);
    setCustomResult(null);
    setError('');
    try {
      const { data } = await axios.post('/api/summarize', {
        articleText: customText,
        company: customCompany || 'Unknown Company',
      });
      setCustomResult(data.summary);
    } catch (err) {
      setError('Failed to analyze: ' + err.message);
    } finally {
      setCustomLoading(false);
    }
  };

  const formatAnalysis = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h5 key={i} className='mt-3 fw-bold'>{line.replace(/\*\*/g, '')}</h5>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={i} className='mb-1'>{line.replace(/^[*-] /, '').replace(/\*\*/g, '')}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className='mb-2'>{line.replace(/\*\*/g, '')}</p>;
    });
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a472a, #2d6a4f)', padding: '3rem 0', marginBottom: '2rem' }}>
        <Container>
          <h1 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            🌍 Tech Industry Sustainability Analyzer
          </h1>
          <p style={{ color: '#b7e4c7', fontSize: '1.1rem', marginBottom: 0 }}>
            Powered by Google Gemini AI — Analyzing environmental initiatives of leading tech companies
          </p>
          <div className='mt-3'>
            <Badge bg='success' className='me-2'>COMP308 Lab 5</Badge>
            <Badge bg='light' text='dark'>Gemini 2.5 Flash</Badge>
          </div>
        </Container>
      </div>

      <Container className='pb-5'>
        {error && <Alert variant='danger' dismissible onClose={() => setError('')}>{error}</Alert>}

        <Tabs defaultActiveKey='overview' className='mb-4'>

          <Tab eventKey='overview' title='📊 Full Analysis'>
            <Card className='mb-4 shadow-sm'>
              <Card.Body className='p-4'>
                <h4>Comprehensive Sustainability Analysis</h4>
                <p className='text-muted'>
                  Use Gemini AI to generate a comprehensive analysis of sustainability initiatives
                  across Microsoft, Amazon, Google, and Meta.
                </p>
                <Button variant='success' size='lg' onClick={analyzeAll} disabled={allLoading}>
                  {allLoading
                    ? <><Spinner size='sm' className='me-2' />Analyzing with Gemini AI...</>
                    : '🤖 Generate Full Analysis with Gemini'}
                </Button>
                {allAnalysis && (
                  <div className='mt-4 p-4' style={{ background: '#f0fff4', borderRadius: 8, borderLeft: '4px solid #2d6a4f' }}>
                    <h5 className='text-success mb-3'>✅ Gemini AI Analysis Complete</h5>
                    <div style={{ lineHeight: 1.8 }}>{formatAnalysis(allAnalysis)}</div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey='companies' title='🏢 By Company'>
            <Row>
              {ARTICLES.map(article => (
                <Col md={6} key={article.company} className='mb-4'>
                  <Card className='h-100 shadow-sm'>
                    <Card.Header style={{ background: article.color, color: '#fff' }}>
                      <h5 className='mb-0'>{article.icon} {article.company}</h5>
                    </Card.Header>
                    <Card.Body>
                      <p className='text-muted small'>{article.text.substring(0, 150)}...</p>
                      <a href={article.url} target='_blank' rel='noreferrer' className='small text-decoration-none'>
                        🔗 {article.url.substring(0, 40)}...
                      </a>
                      <div className='mt-3'>
                        <Button
                          size='sm'
                          style={{ background: article.color, border: 'none' }}
                          onClick={() => analyzeOne(article)}
                          disabled={individualLoading[article.company]}
                        >
                          {individualLoading[article.company]
                            ? <><Spinner size='sm' className='me-1' />Analyzing...</>
                            : '🤖 Analyze with Gemini'}
                        </Button>
                      </div>
                      {individualResults[article.company] && (
                        <div className='mt-3 p-3' style={{ background: '#f8f9fa', borderRadius: 6, fontSize: '0.9rem' }}>
                          <strong className='text-success'>Gemini Analysis:</strong>
                          <div className='mt-2' style={{ lineHeight: 1.7 }}>
                            {formatAnalysis(individualResults[article.company])}
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>

          <Tab eventKey='custom' title='✏️ Custom Article'>
            <Card className='shadow-sm'>
              <Card.Body className='p-4'>
                <h4>Analyze Your Own Article</h4>
                <p className='text-muted'>
                  Paste any article about tech sustainability and Gemini will analyze it for you.
                </p>
                <Form onSubmit={analyzeCustom}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='e.g. Apple, Tesla, IBM...'
                      value={customCompany}
                      onChange={e => setCustomCompany(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Article Content</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={8}
                      placeholder='Paste article text here...'
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant='success' type='submit' disabled={customLoading}>
                    {customLoading
                      ? <><Spinner size='sm' className='me-2' />Analyzing...</>
                      : '🤖 Analyze with Gemini'}
                  </Button>
                </Form>
                {customResult && (
                  <div className='mt-4 p-4' style={{ background: '#f0fff4', borderRadius: 8, borderLeft: '4px solid #2d6a4f' }}>
                    <h5 className='text-success mb-3'>✅ Gemini Analysis</h5>
                    <div style={{ lineHeight: 1.8 }}>{formatAnalysis(customResult)}</div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

        </Tabs>
      </Container>
    </div>
  );
}