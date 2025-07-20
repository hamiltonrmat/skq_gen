import React, { useState, useCallback } from 'react';
import { generateCourseMarkdown } from './services/geminiService';
import { GraduationCapIcon, MagicWandIcon, ClipboardIcon, CheckIcon, LoadingSpinner } from './components/icons';

const App: React.FC = () => {
    const [formData, setFormData] = useState({
        domaine: '',
        nomCompetence: '',
        sujetPrincipal: '',
        motsCles: '',
    });
    const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerateClick = useCallback(async () => {
        if (!formData.domaine.trim() || !formData.nomCompetence.trim() || !formData.sujetPrincipal.trim()) {
            setError('Veuillez remplir les champs Domaine, Compétence et Sujet.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedMarkdown('');
        try {
            const markdown = await generateCourseMarkdown(formData);
            setGeneratedMarkdown(markdown);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const handleCopyClick = useCallback(() => {
        if (!generatedMarkdown) return;
        navigator.clipboard.writeText(generatedMarkdown).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [generatedMarkdown]);

    const isGenerateButtonDisabled = isLoading || !formData.domaine || !formData.nomCompetence || !formData.sujetPrincipal;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <header className="flex items-center justify-center mb-8">
                    <GraduationCapIcon className="h-10 w-10 text-indigo-400" />
                    <h1 className="ml-4 text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                        Générateur de Cours SkillQuest
                    </h1>
                </header>

                {/* Input Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Domaine */}
                        <div>
                            <label htmlFor="domaine" className="block text-sm font-medium text-gray-300 mb-2">Domaine</label>
                            <input
                                type="text"
                                id="domaine"
                                value={formData.domaine}
                                onChange={handleInputChange}
                                placeholder="Ex: Développement Web"
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Nom de la compétence */}
                        <div>
                            <label htmlFor="nomCompetence" className="block text-sm font-medium text-gray-300 mb-2">Nom de la compétence</label>
                            <input
                                type="text"
                                id="nomCompetence"
                                value={formData.nomCompetence}
                                onChange={handleInputChange}
                                placeholder="Ex: React.js"
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Sujet principal */}
                        <div className="md:col-span-2">
                            <label htmlFor="sujetPrincipal" className="block text-sm font-medium text-gray-300 mb-2">Sujet principal</label>
                            <input
                                type="text"
                                id="sujetPrincipal"
                                value={formData.sujetPrincipal}
                                onChange={handleInputChange}
                                placeholder="Ex: Introduction aux Hooks et au state"
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Mots-clés */}
                        <div className="md:col-span-2">
                            <label htmlFor="motsCles" className="block text-sm font-medium text-gray-300 mb-2">Mots-clés (optionnel)</label>
                            <input
                                type="text"
                                id="motsCles"
                                value={formData.motsCles}
                                onChange={handleInputChange}
                                placeholder="Ex: useState, useEffect, components, props"
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200"
                                disabled={isLoading}
                            />
                             <p className="text-xs text-gray-400 mt-1">Séparez les mots-clés par des virgules.</p>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

                    <button
                        onClick={handleGenerateClick}
                        disabled={isGenerateButtonDisabled}
                        className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner className="h-5 w-5 mr-3" />
                                Génération en cours...
                            </>
                        ) : (
                            <>
                                <MagicWandIcon className="h-5 w-5 mr-2" />
                                Générer le Plan de Cours
                            </>
                        )}
                    </button>
                </div>
                
                {/* Output Section */}
                {(generatedMarkdown || isLoading) && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-300">Résultat Markdown</h2>
                            {generatedMarkdown && !isLoading && (
                                <button
                                    onClick={handleCopyClick}
                                    className="flex items-center px-4 py-2 bg-gray-700 text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    {isCopied ? (
                                        <>
                                            <CheckIcon className="h-5 w-5 mr-2 text-green-400" />
                                            Copié !
                                        </>
                                    ) : (
                                        <>
                                            <ClipboardIcon className="h-5 w-5 mr-2" />
                                            Copier
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-inner min-h-[200px]">
                            {isLoading && !generatedMarkdown && (
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <LoadingSpinner className="h-8 w-8 mx-auto text-indigo-400" />
                                        <p className="mt-2 text-gray-400">L'IA prépare votre cours...</p>
                                    </div>
                                </div>
                            )}
                            <pre className="p-6 w-full h-full text-left whitespace-pre-wrap break-words overflow-auto max-h-[60vh]">
                                <code className="font-mono text-sm text-gray-300">
                                    {generatedMarkdown}
                                </code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>
             <footer className="text-center mt-12 text-gray-500 text-sm">
                <p>Propulsé par Google Gemini pour SkillQuest.</p>
            </footer>
        </div>
    );
};

export default App;
