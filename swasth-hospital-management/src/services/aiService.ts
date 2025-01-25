import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const generateTreatmentSuggestions = async (
  symptoms: string[],
  medicalHistory: any,
  testResults: any
) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant helping doctors with treatment suggestions.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            symptoms,
            medicalHistory,
            testResults,
          }),
        },
      ],
    });

    return response.choices[0].message?.content;
  } catch (error) {
    console.error('Error generating treatment suggestions:', error);
    throw error;
  }
};

export const analyzeTestResults = async (testResults: any) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant analyzing test results.',
        },
        {
          role: 'user',
          content: JSON.stringify(testResults),
        },
      ],
    });

    return response.choices[0].message?.content;
  } catch (error) {
    console.error('Error analyzing test results:', error);
    throw error;
  }
}; 