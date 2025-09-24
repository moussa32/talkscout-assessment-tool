import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const { language, question, answer } = await request.json();

    // Get Arabic language name
    const arabicLanguageName = getArabicLanguageName(language);

    // Construct the prompt for Gemini
    const prompt = `أنت مدرب محترف لموظفي الكول سنتر. قيّم الإجابة التالية باللغة ${arabicLanguageName} حسب المعايير التالية:

    - القواعد اللغوية  
    - أسلوب الحديث  
    - وضوح الرد  
    - اللباقة  
    - الاحترافية  
    
    التقييم يكون من 0 إلى 10.  
    أعطني ملخصًا مختصرًا بنقاط القوة والضعف على شكل قائمة.  
    اكتب التقييم والشرح بنفس لغة التقييم المطلوبة (${arabicLanguageName}).  
    لا تذكر السؤال أو الإجابة في الرد. كن مباشرًا وموجزًا.
    هذه هي اجابة المستخدم: ${answer} برجاء كتابة التقييم في صورة score:[Your score here]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const text = response.text;

    // Extract score from the assessment text - try multiple patterns
    let score = 0;
    
    // First try to match the new format: score:[number]
    const newScoreMatch = text.match(/score:\s*(\d+(\.\d+)?)/i);
    if (newScoreMatch) {
      score = parseFloat(newScoreMatch[1]);
    } else {
      // Fall back to the original format: number/10
      const oldScoreMatch = text.match(/(\d+(\.\d+)?)\s*\/\s*10/);
      if (oldScoreMatch) {
        score = parseFloat(oldScoreMatch[1]);
      }
    }
    
    // Ensure score is a valid number between 0 and 10
    if (isNaN(score)) score = 0;
    if (score < 0) score = 0;
    if (score > 10) score = 10;
    
    // Round to one decimal place for consistency
    score = Math.round(score * 10) / 10;

    return NextResponse.json({
      success: true,
      assessment: text,
      score: score,
      question: question,
      answer: answer,
      language: language,
    });
  } catch (error) {
    console.error("Error in assessment API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Function to get language name in Arabic
function getArabicLanguageName(lang) {
  const languageMap = {
    english: "الإنجليزية",
    german: "الألمانية",
    dutch: "الهولندية",
  };
  return languageMap[lang] || lang;
}
