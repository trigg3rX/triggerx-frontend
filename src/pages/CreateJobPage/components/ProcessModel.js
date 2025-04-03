import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

const ProcessModal = ({ isOpen, steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef(null);
  const [character, setCharacter] = useState([{ x: 10, y: 10 }]); // Character instead of snake
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0); // Track animation frame

  const gridSize = 20;
  const tileSize = 30;

  useEffect(() => {
    if (
      currentStep < steps.length &&
      steps[currentStep].status === "completed"
    ) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 10000);
    }
  }, [steps, currentStep]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      if (keyMap[e.key] && !gameOver) {
        setDirection(keyMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, gameStarted]);

  // Load character frames
  const characterFrames = [];
  for (let i = 1; i <= 10; i++) {
    const img = new Image();
    img.src = `/character/frame${i}.png`; // Update with actual path
    characterFrames.push(img);
  }

  // Load Ethereum token image
  const ethImage = new Image();
  ethImage.src =
    "https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg";

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveCharacter = () => {
      setCharacter((prevCharacter) => {
        let newCharacter = [...prevCharacter];
        let head = { ...newCharacter[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
          default:
            break;
        }

        // Check if character hits the boundary
        if (
          head.x < 0 ||
          head.x >= gridSize ||
          head.y < 0 ||
          head.y >= gridSize
        ) {
          setGameOver(true);
          return prevCharacter;
        }

        newCharacter.unshift(head);

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          });
          setScore((prev) => prev + 10);
        } else {
          newCharacter.pop();
        }

        return newCharacter;
      });
      // Update frame for animation
      setFrameIndex((prev) => (prev + 1) % 10);
    };

    const gameLoop = setInterval(moveCharacter, 200);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, gameStarted]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   // Draw Character
   const currentFrame = characterFrames[frameIndex];
   character.forEach((segment) => {
     ctx.drawImage(
       currentFrame,
       segment.x * tileSize,
       segment.y * tileSize,
       tileSize,
       tileSize
     );
   });

   // Draw Ethereum token
   ctx.drawImage(ethImage, food.x * tileSize, food.y * tileSize, tileSize, tileSize);

   if (!gameStarted) {
     ctx.fillStyle = "black";
     ctx.font = "18px Arial";
     ctx.fillText("Tap to Start", canvas.width / 3, canvas.height / 2);
   }

   if (gameOver) {
     ctx.fillStyle = "black";
     ctx.font = "20px Arial";
     ctx.fillText("Game Over!", canvas.width / 3, canvas.height / 2);
     ctx.fillText(`Score: ${score}`, canvas.width / 3 + 10, canvas.height / 2 + 30);
     ctx.fillText("Tap to Restart", canvas.width / 3, canvas.height / 2 + 60);
   }
 }, [character, food, isOpen, gameOver, gameStarted, score, frameIndex, characterFrames, ethImage]);

  useEffect(() => {
    if (isOpen) {
      setGameStarted(false);
      setCharacter([{ x: 10, y: 10 }]);
      setFood({ x: 15, y: 15 });
      setDirection("RIGHT");
      setGameOver(false);
      setScore(0);
    }
  }, [isOpen]);

  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) {
      setGameStarted(true);
      setCharacter([{ x: 10, y: 10 }]);
      setFood({ x: 15, y: 15 });
      setDirection("RIGHT");
      setGameOver(false);
      setScore(0);
    }
  };
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Estimate Fee"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-[90%] max-w-md z-[10000]"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white text-xl text-center">Creating Job</h3>

        <div>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`transition-all duration-700 ease-in-out ${
                index > currentStep
                  ? "opacity-0 scale-95 h-0 overflow-hidden"
                  : "opacity-100 scale-100 h-auto"
              } ${index === currentStep ? "animate-pulse" : ""}`}
            >
              <h4 className="text-md">{step.text}</h4>
            </div>
          ))}

          <div className="h-1.5 bg-black opacity-50 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gray-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full bg-black rounded-xl p-4 flex flex-col gap-2 shadow-lg border border-gray-600 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={gridSize * tileSize}
          height={gridSize * tileSize}
          onClick={handleCanvasClick}
        />
      </div>
      <p className="text-white text-center mt-2">
        Use arrow keys and collect tokens
      </p>
    </Modal>
  );
};

export default ProcessModal;
