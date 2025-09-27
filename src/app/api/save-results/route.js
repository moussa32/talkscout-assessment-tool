import { createClient } from "@/utils/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = await createClient();
  try {
    // Log the start of the request for debugging
    console.log("Starting save-results API request");

    const requestData = await request.json();
    console.log("Request data received:", JSON.stringify(requestData, null, 2));

    const { userData, languageQuizScore, callCenterScore, totalScore } =
      requestData;

    // Validate required data
    if (
      !userData ||
      !userData.name ||
      !userData.phoneNumber ||
      !userData.language
    ) {
      console.error("Missing required user data");
      return NextResponse.json(
        { success: false, error: "Missing required user data" },
        { status: 400 }
      );
    }

    // Check if this user already has a completed assessment with the same data
    console.log("Checking for existing assessment");
    const { data: existingAssessment, error: checkError } = await supabase
      .from("assessments")
      .select("id")
      .eq("user_name", userData.name)
      .eq("phone_number", userData.phoneNumber)
      .eq("language", userData.language)
      .order("created_at", { ascending: false })
      .limit(1);

    if (checkError) {
      console.error("Error checking for existing assessment:", checkError);
      throw checkError;
    }

    // If we already have a recent assessment for this user, return it instead of creating a new one
    if (existingAssessment && existingAssessment.length > 0) {
      console.log("Found existing assessment:", existingAssessment[0].id);
      return NextResponse.json({
        success: true,
        message: "Assessment results already exist",
        assessmentId: existingAssessment[0].id,
        alreadyExists: true,
      });
    }

    // Prepare data for insertion
    const assessmentData = {
      user_name: userData.name,
      phone_number: userData.phoneNumber,
      language: userData.language,
      language_quiz_score: parseFloat(languageQuizScore || 0) || 0,
      call_center_score: parseFloat(callCenterScore || 0) || 0,
      total_score: parseFloat(totalScore || 0) || 0,
      created_at: new Date().toISOString(),
    };

    // Ensure all scores are valid numbers
    if (isNaN(assessmentData.language_quiz_score))
      assessmentData.language_quiz_score = 0;
    if (isNaN(assessmentData.call_center_score))
      assessmentData.call_center_score = 0;
    if (isNaN(assessmentData.total_score)) assessmentData.total_score = 0;

    console.log("Inserting new assessment:", assessmentData);

    // Save both category scores and total score to the database
    const { data: insertedData, error: assessmentError } = await supabase
      .from("assessments")
      .insert([assessmentData])
      .select();

    if (assessmentError) {
      console.error("Error inserting assessment:", assessmentError);
      throw assessmentError;
    }

    if (!insertedData || insertedData.length === 0) {
      console.error("No data returned after insert");
      throw new Error("Failed to insert assessment data");
    }

    const assessmentId = insertedData[0].id;
    console.log("Successfully inserted assessment with ID:", assessmentId);

    return NextResponse.json({
      success: true,
      message: "Assessment results saved successfully",
      assessmentId,
    });
  } catch (error) {
    console.error("Error saving assessment results:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
