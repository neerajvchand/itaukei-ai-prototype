import React, { useState, useRef } from 'react';
import { Shield, Users, Book, Eye, Upload, Mic, Play, Pause, CheckCircle, AlertTriangle, Globe, Database, MessageSquare } from 'lucide-react';

const iTaukeiPrototype = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [ipAlerts] = useState([
    {
      id: 1,
      platform: 'Etsy',
      item: 'Fiji Tapa Cloth Design',
      status: 'Under Review',
      confidence: 87,
      action: 'Takedown Notice Sent'
    },
    {
      id: 2,
      platform: 'Amazon',
      item: 'Traditional Fijian Pattern',
      status: 'Violation Confirmed',
      confidence: 94,
      action: 'Legal Action Recommended'
    }
  ]);
  const [culturalQuery, setCulturalQuery] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [userRole, setUserRole] = useState('educator');

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const checkCulturalPermissions = (content, user) => {
    const permissions = {
      educator: { canAccess: true, restrictions: ['sacred_ceremonies'] },
      elder: { canAccess: true, restrictions: [] },
      youth: { canAccess: true, restrictions: ['genealogy', 'sacred_ceremonies'] },
      researcher: { canAccess: false, restrictions: ['all'] }
    };
    return permissions[user] || permissions.researcher;
  };

  const generateCulturalResponse = (query) => {
    const responses = {
      'bula': 'Bula! In iTaukei culture, "bula" means more than hello - it represents life, health, and positive energy. When we say bula, we are wishing vitality and well-being upon others. This greeting connects us to our vanua (land) and our community values.',
      'vanua': 'Vanua is a fundamental concept in iTaukei worldview. It encompasses not just the physical land, but the people, traditions, and spiritual connections that bind a community together. The vanua includes all living and ancestral relationships to a place.',
      'matanitu': 'The matanitu refers to the traditional confederacy or kingdom structure in iTaukei society. It represents the political and social organization that connects different yavusa (tribes) under traditional leadership.',
      'solesolevaki': 'Solesolevaki is the iTaukei tradition of communal work and mutual assistance. It embodies the spirit of cooperation where community members come together to help one another, whether for farming, house-building, or community projects.',
      'tabua': 'The tabua (whale\'s tooth) holds deep ceremonial significance in iTaukei culture. It is presented during important occasions like marriages, apologies, and traditional ceremonies, symbolizing respect, sincerity, and the gravity of the occasion.'
    };
    
    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return response;
      }
    }
    return 'I can help explain iTaukei cultural concepts, language, and traditions. Please ask about specific terms or practices you\'d like to understand better. Try asking about: bula, vanua, matanitu, solesolevaki, or tabua.';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setTimeout(() => {
          setTranscription('Au sa bula vinaka - I am very well');
        }, 1500);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCulturalQuery = () => {
    if (!culturalQuery.trim()) {
      setLlmResponse('Please enter a question about iTaukei culture.');
      return;
    }

    const permissions = checkCulturalPermissions(culturalQuery, userRole);
    
    if (!permissions.canAccess) {
      setLlmResponse('Access denied: You do not have cultural permissions to access this information. Please contact a traditional authority or cultural educator.');
      return;
    }

    const response = generateCulturalResponse(culturalQuery);
    setLlmResponse(response);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Welcome to the iTaukei AI Cultural Safeguarding Platform</h2>
        <p className="text-blue-800">This prototype demonstrates AI-powered solutions for protecting and preserving iTaukei cultural heritage. Explore the different modules to see how technology can serve cultural sovereignty.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Cultural Assets Protected</p>
              <p className="text-2xl font-bold text-blue-900">247</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Learners</p>
              <p className="text-2xl font-bold text-green-900">1,234</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Oral Histories Archived</p>
              <p className="text-2xl font-bold text-purple-900">89</p>
            </div>
            <Book className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">IP Violations Detected</p>
              <p className="text-2xl font-bold text-red-900">12</p>
            </div>
            <Eye className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          Recent Cultural Governance Alerts
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
            <span className="text-sm text-yellow-800">Unauthorized access attempt to sacred ceremony recordings</span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Blocked</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
            <span className="text-sm text-blue-800">New cultural asset digitization completed - Nadroga traditional songs</span>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Archived</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
            <span className="text-sm text-green-800">Elder council approved new language learning module</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Approved</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Cultural Access Control</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Role</label>
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="educator">Educator</option>
              <option value="elder">Traditional Elder</option>
              <option value="youth">Youth Learner</option>
              <option value="researcher">External Researcher</option>
            </select>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Access Permissions for {userRole}</h4>
            <div className="space-y-2 text-sm">
              {userRole === 'elder' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Full access to all cultural knowledge
                </div>
              )}
              {userRole === 'educator' && (
                <>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Access to educational materials
                  </div>
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Restricted: Sacred ceremonies
                  </div>
                </>
              )}
              {userRole === 'youth' && (
                <>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Access to language learning materials
                  </div>
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Restricted: Genealogical records, Sacred ceremonies
                  </div>
                </>
              )}
              {userRole === 'researcher' && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Access denied - Cultural authority approval required
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">OCAP Compliance Dashboard</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
            <div className="text-2xl font-bold text-green-900">100%</div>
            <div className="text-sm text-green-600">Ownership Tracking</div>
          </div>
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="text-2xl font-bold text-blue-900">98%</div>
            <div className="text-sm text-blue-600">Access Control Active</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Traditional Authority Integration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
            <span className="text-sm text-blue-800">Bose Levu Vakaturaga Connection</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
            <span className="text-sm text-green-800">Provincial Council Oversight</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLLM = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Na iVola ni Vanua - iTaukei Cultural AI</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ask about iTaukei culture</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={culturalQuery}
                onChange={(e) => setCulturalQuery(e.target.value)}
                placeholder="Try: bula, vanua, matanitu, solesolevaki, tabua..."
                className="flex-1 p-2 border border-gray-300 rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && handleCulturalQuery()}
              />
              <button
                onClick={handleCulturalQuery}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Ask
              </button>
            </div>
          </div>
          
          {llmResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Cultural Response:</h4>
              <p className="text-sm text-blue-900">{llmResponse}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Model Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Bauan Dialect Model</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Nadroga Dialect Model</span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Training</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Cultural Context Engine</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Sacred Knowledge Filter</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Protected</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIPMonitor = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Cultural IP Protection Monitor</h3>
        
        <div className="space-y-4">
          {ipAlerts.map(alert => (
            <div key={alert.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{alert.platform}</span>
                  <span className="text-sm text-gray-600">- {alert.item}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  alert.status === 'Violation Confirmed' 
                    ? 'bg-red-200 text-red-800' 
                    : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {alert.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Confidence: {alert.confidence}%</span>
                <span>{alert.action}</span>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      alert.confidence > 90 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${alert.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Monitoring Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Etsy', 'Amazon', 'Instagram', 'Pinterest'].map(platform => (
            <div key={platform} className="text-center p-3 bg-gray-50 border rounded">
              <div className="font-medium">{platform}</div>
              <div className="text-sm text-green-600">Monitored</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Pattern Recognition Capabilities</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="text-lg font-bold text-blue-900">Masi Patterns</div>
            <div className="text-sm text-blue-600">Traditional Tapa Cloth</div>
          </div>
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
            <div className="text-lg font-bold text-green-900">Weaving Designs</div>
            <div className="text-sm text-green-600">Traditional Textiles</div>
          </div>
          <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded">
            <div className="text-lg font-bold text-purple-900">Carving Motifs</div>
            <div className="text-sm text-purple-600">Wood & Stone Work</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchive = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Cultural Heritage Archive</h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload oral history recordings</p>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Audio File
            </label>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Voice Recording</h4>
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isRecording 
                    ? 'bg-red-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}
              >
                {isRecording ? <Pause className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              
              {audioBlob && (
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
                  <Play className="h-4 w-4 mr-2" />
                  Play Recording
                </button>
              )}
            </div>

            {transcription && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <h5 className="font-medium text-green-800 mb-1">Transcription:</h5>
                <p className="text-green-700">{transcription}</p>
                <p className="text-xs text-green-600 mt-1">Note: This is a simulated transcription for demonstration purposes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Archive Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
            <Database className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-900">89</div>
            <div className="text-sm text-blue-600">Oral Histories</div>
          </div>
          <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded">
            <Book className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-900">1,247</div>
            <div className="text-sm text-purple-600">Traditional Stories</div>
          </div>
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
            <Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-900">156</div>
            <div className="text-sm text-green-600">Contributors</div>
          </div>
        </div>
      </div>
    </div>
  );

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Database },
    { id: 'governance', label: 'Cultural Governance', icon: Shield },
    { id: 'llm', label: 'AI Assistant', icon: MessageSquare },
    { id: 'ip-monitor', label: 'IP Protection', icon: Eye },
    { id: 'archive', label: 'Heritage Archive', icon: Book }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">iTaukei AI Cultural Safeguarding Platform</h1>
                <p className="text-xs text-gray-600">Prototype Demonstration</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              v1.0 | Neeraj Chand
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          <nav className="w-64 space-y-2">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <main className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'governance' && renderGovernance()}
            {activeTab === 'llm' && renderLLM()}
            {activeTab === 'ip-monitor' && renderIPMonitor()}
            {activeTab === 'archive' && renderArchive()}
          </main>
        </div>
      </div>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>This prototype demonstrates AI technology serving iTaukei cultural sovereignty and preservation.</p>
            <p className="mt-1">Built with respect for traditional knowledge and indigenous data governance principles.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default iTaukeiPrototype;
