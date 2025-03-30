import Modal from "react-modal";
import { FiInfo } from "react-icons/fi";
import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import { useBalance, useAccount } from "wagmi";

if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

export function EstimatedFeeModal({
  isOpen,
  showProcessing,
  showFees,
  setIsLoading,
  steps,
  onClose,
  estimatedFee,
  userBalance,
  onStake,
}) {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({
    address,
  });

  const hasEnoughBalance = userBalance >= estimatedFee;
  const requiredEth = (0.001 * estimatedFee).toFixed(6);
  const hasEnoughEthToStake =
    ethBalance && Number(ethBalance.formatted) >= Number(requiredEth);
  const [showRequiredTGTooltip, setShowRequiredTGTooltip] = useState(false);
  const [showBalanceTooltip, setShowBalanceTooltip] = useState(false);
  const [showStakeTooltip, setShowStakeTooltip] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef(null);
  const [character, setCharacter] = useState([{ x: 10, y: 10 }]); // Character instead of snake
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0); // Track animation frame

  const gridSize = 17;
  const tileSize = 28;

  const [foodEatenAnimation, setFoodEatenAnimation] = useState(null);

  const resetProcessing = () => {
    setCurrentStep(0);
    setGameStarted(false); // Reset game state as well
    setCharacter([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
  };

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
    img.src = `/character/frame${i}.svg`; // Update with actual path
    characterFrames.push(img);
  }

  // Load Ethereum token image
  const ethImage = new Image();
  ethImage.src = "/character/token.svg";
    // "https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg";

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveCharacter = () => {
      if (!gameStarted || gameOver) return;
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
          setScore((prev) => prev + 0.5);
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          });
          // Trigger "+1" animation at the food's position
          setFoodEatenAnimation({ x: food.x, y: food.y });
          setTimeout(() => setFoodEatenAnimation(null), 500); // Duration of the animation (0.5 seconds)
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

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Character
    const currentFrame = characterFrames[frameIndex];
    character.forEach((segment) => {
      ctx.save();
      ctx.translate(
        segment.x * tileSize + tileSize / 2,
        segment.y * tileSize + tileSize / 2
      );

      if (direction === "LEFT") {
        ctx.scale(-1, 1);
      }

      ctx.drawImage(
        currentFrame,
        direction === "LEFT" ? -tileSize / 2 : -tileSize / 2,
        -tileSize / 2,
        tileSize,
        tileSize
      );

      ctx.restore();
    });

    // Draw Ethereum token
    ctx.drawImage(
      ethImage,
      food.x * tileSize,
      food.y * tileSize,
      tileSize,
      tileSize
    );

    // Draw "+1" animation
    if (foodEatenAnimation) {
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(
        "+1",
        foodEatenAnimation.x * tileSize + tileSize / 4,
        foodEatenAnimation.y * tileSize + tileSize / 1.5 // Adjust vertical position
      );
    }

    if (!gameStarted) {
      ctx.fillStyle = "yellow";
      ctx.font = "18px Arial";
      ctx.fillText(
        "We're calculating fees, Sit back and play!",
        canvas.width / 5 - 10,
        canvas.height / 3
      );
      ctx.fillText(
        "Tap to Start",
        canvas.width / 3 + 40,
        canvas.height / 2 + 30
      );
      ctx.fillText(
        "Use Arrow keys and collect tokens",
        canvas.width / 3 - 50,
        canvas.height / 3 + 60
      );
    }

    if (gameOver) {
      ctx.fillStyle = "yellow";
      ctx.font = "20px Arial";
      ctx.fillText(
        "Oops! Game Over!",
        canvas.width / 3,
        canvas.height / 2 - 40
      );
      ctx.fillText(
        `Score: ${score}`,
        canvas.width / 3 + 40,
        canvas.height / 2 - 10
      );
      ctx.fillText(
        "Tap to Restart",
        canvas.width / 3 + 20,
        canvas.height / 2 + 60
      );
    }
  }, [character, food, isOpen, gameOver, gameStarted, score, frameIndex, characterFrames, ethImage, direction, foodEatenAnimation]);

  useEffect(() => {
    if (isOpen) {
      resetProcessing(); // Reset on modal open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset"; // Cleanup on unmount
    };
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

  const handleClose = () => {
    resetProcessing();
    document.body.style.overflow = "unset"; // Enable scroll on close
    onClose();
  };

  const handleStake = () => {
    resetProcessing(); // Reset before staking, if needed
    document.body.style.overflow = "unset"; // Enable scroll on stake
    onStake();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose} // Use handleClose
      contentLabel="Estimate Fee"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#141414] p-8 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-md z-[10000]"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
    >
      {showProcessing && !showFees && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl text-center">Creating Job</h3>

          <div>
            {/* Show only the current step's text */}
            {currentStep < steps.length && (
              <div
                key={steps[currentStep].id}
                className="transition-all duration-700 ease-in-out animate-pulse"
              >
                <h4 className="text-md">{steps[currentStep].text}</h4>
              </div>
            )}
            {/* After steps are complete, show last step */}
            {currentStep >= steps.length && (
              <div
                key={steps[steps.length - 1].id}
                className="transition-all duration-700 ease-in-out animate-pulse"
              >
                <h4 className="text-md">{steps[steps.length - 1].text}</h4>
              </div>
            )}

            <div className="h-1.5 bg-gray-500 opacity-50 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#F8FF7C] transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {(showProcessing || showFees) && (
        <>
          <div className="w-full bg-black rounded-xl flex flex-col gap-2 shadow-lg border border-gray-600 ">
          {!(showFees && gameOver) ? (
            <>
              <canvas
                ref={canvasRef}
                width={gridSize * tileSize}
                height={gridSize * tileSize}
                onClick={handleCanvasClick}
              />
            </>
          ) : (
            <div className="text-white text-center py-4">
              {score > 0 ? `Well played! Your score: ${score}` : "Game Over!"}
            </div>
          )}
          </div>
          <div className="text-white text-center py-2">Score: {score}</div>
        </>
      )}

      {showFees && (
        <>
          <h2 className="text-2xl font-bold my-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-white text-center">
            Estimated Fee
          </h2>
          <div className="space-y-4 mb-6">
            <div className="text-gray-300 flex justify-between">
              <div className="flex">
                Required TG
                <div className="relative top-[4px]">
                  <FiInfo
                    className="text-gray-400 hover:text-white cursor-pointer ml-2"
                    size={15}
                    onMouseEnter={() => setShowRequiredTGTooltip(true)}
                    onMouseLeave={() => setShowRequiredTGTooltip(false)}
                  />
                  {showRequiredTGTooltip && (
                    <div className="absolute right-0 mt-2 p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[280px]">
                      <div className="flex flex-col gap-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>
                            TriggerGas (TG) is the standard unit for calculating
                            computational and resource costs in the TriggerX
                            platform.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p>
                {" "}
                {estimatedFee && estimatedFee > 0
                  ? ` ${estimatedFee.toFixed(4)} TG`
                  : "Something went wrong"}
              </p>
            </div>

            <div className="text-gray-300 flex justify-between">
              <p className="flex">Your TG Balance</p>
              <Tooltip title={userBalance || "0"} placement="top">
                <p className="cursor-help">
                  {userBalance ? Number(userBalance).toFixed(6) : "0.0000"}{" "}
                </p>
              </Tooltip>
            </div>

            {!hasEnoughBalance && (
              <div className="text-gray-300 flex justify-between">
                <div className="flex">
                  {" "}
                  Required ETH to stake
                  <div className="relative top-[4px]">
                    <FiInfo
                      className="text-gray-400 hover:text-white cursor-pointer ml-2"
                      size={15}
                      onMouseEnter={() => setShowStakeTooltip(true)}
                      onMouseLeave={() => setShowStakeTooltip(false)}
                    />
                    {showStakeTooltip && (
                      <div className="absolute right-0 mt-2 p-4 bg-[#181818] rounded-xl border border-[#4B4A4A] shadow-lg z-50 w-[280px]">
                        <div className="flex flex-col gap-2 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <span>
                              Required ETH to Stake is based on the total
                              TriggerGas consumed and TriggerGas's unit price.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p> {(0.001 * estimatedFee).toFixed(6)} ETH </p>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {hasEnoughBalance ? (
              <button
                onClick={handleStake} // Use handleStake
                // disabled={!estimatedFee || estimatedFee <= 0} // Disable if fee is invalid
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  !estimatedFee || estimatedFee <= 0
                    ? "bg-gray-400 text-gray-700 " // Disabled styles
                    : "bg-white text-black" // Enabled styles
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleStake} // Use handleStake
                disabled={!hasEnoughEthToStake}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  !hasEnoughEthToStake
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-white text-black"
                }`}
              >
                {hasEnoughEthToStake ? "Stake ETH" : "Insufficient ETH"}
              </button>
            )}
            <button
              onClick={handleClose} // Use handleClose
              className="flex-1 px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
