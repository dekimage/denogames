import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";
import { gameFiles } from "@/data/gameFiles";

export async function GET(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Get real user data from Firebase using firestore
    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    // Get game files from static data
    const files = gameFiles[params.gameId];
    const variableFiles = gameFiles.variableFiles?.[params.gameId];

    if (!files) {
      return NextResponse.json(
        {
          error: "Game files not found",
          requestedId: params.gameId,
          availableIds: Object.keys(gameFiles),
        },
        { status: 404 }
      );
    }

    // Process regular files
    const processedFiles = files.map((fileData) => {
      const isLocked = fileData.requirements
        ? checkLockStatus(fileData.requirements, userData)
        : false;

      return {
        id: fileData.id,
        ...fileData,
        isLocked,
        lockReason: isLocked
          ? getLockReason(fileData.requirements, userData)
          : null,
        files: isLocked ? undefined : fileData.files,
      };
    });

    // Process variable files if they exist
    const processedVariableFiles = variableFiles
      ? {
          luckyGenerator: variableFiles.luckyGenerator?.enabled
            ? {
                ...variableFiles.luckyGenerator,
                isLocked:
                  !userData.unlockedGenerators?.[params.gameId]?.[
                    variableFiles.luckyGenerator.requiredKey
                  ],
                requirements: {
                  type: "purchase",
                  value: variableFiles.luckyGenerator.productId,
                },
              }
            : null,
          makeYourOwn: variableFiles.makeYourOwn?.enabled
            ? {
                ...variableFiles.makeYourOwn,
                isLocked:
                  !userData.unlockedGenerators?.[params.gameId]?.[
                    variableFiles.makeYourOwn.requiredKey
                  ],
                requirements: {
                  type: "purchase",
                  value: variableFiles.makeYourOwn.productId,
                },
              }
            : null,
        }
      : null;

    return NextResponse.json({
      files: processedFiles,
      variableFiles: processedVariableFiles,
    });
  } catch (error) {
    console.error("Error in game-files API:", error);
    return NextResponse.json(
      { error: "Failed to fetch game files", details: error.message },
      { status: 500 }
    );
  }
}

function checkLockStatus(requirement, userData) {
  if (!requirement) return false;

  switch (requirement.type) {
    case "level":
      return !userData.level || userData.level < requirement.value;
    case "achievement":
      return (
        !userData.achievements ||
        !userData.achievements.includes(requirement.value)
      );
    case "purchase":
      return (
        !userData.purchasedProducts ||
        !userData.purchasedProducts.includes(requirement.value)
      );
    default:
      return false;
  }
}

function getLockReason(requirement, userData) {
  if (!requirement) return "Locked";

  switch (requirement.type) {
    case "level":
      return `Requires Level ${requirement.value} (Current: ${
        userData.level || 0
      })`;
    case "achievement":
      return `Requires Achievement #${requirement.value}`;
    case "purchase":
      return "Purchase Required";
    default:
      return "Locked";
  }
}
