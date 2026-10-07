// Computer Vision Biomechanical Engine for Workout Tracking & Pose Telemetry

export type ExerciseType = 'squat' | 'pushup' | 'bicep_curl' | 'shoulder_press' | 'lunge';

export interface Keypoint {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  confidence: number;
  name: string;
}

export interface PoseLandmarks {
  nose: Keypoint;
  leftShoulder: Keypoint;
  rightShoulder: Keypoint;
  leftElbow: Keypoint;
  rightElbow: Keypoint;
  leftWrist: Keypoint;
  rightWrist: Keypoint;
  leftHip: Keypoint;
  rightHip: Keypoint;
  leftKnee: Keypoint;
  rightKnee: Keypoint;
  leftAnkle: Keypoint;
  rightAnkle: Keypoint;
}

export interface FormMetric {
  primaryAngle: number;
  secondaryAngle?: number;
  depthRatio: number; // 0 to 1
  isAtBottom: boolean;
  isAtLockout: boolean;
  formFlaws: string[];
  formScore: number; // 0 - 100
}

export interface RepData {
  repNumber: number;
  durationSeconds: number;
  maxRomPercent: number;
  formScore: number;
  flawsDetected: string[];
  timestamp: number;
}

// Helper to compute angle in degrees at vertex B between lines BA and BC
export function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

// Helper to calculate distance between two keypoints
export function getDistance(a: Keypoint, b: Keypoint): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// Biomechanical Evaluator per Exercise Type
export function evaluatePoseForm(landmarks: PoseLandmarks, exercise: ExerciseType): FormMetric {
  const flaws: string[] = [];
  let primaryAngle = 180;
  let secondaryAngle = 180;
  let depthRatio = 0;
  let isAtBottom = false;
  let isAtLockout = false;
  let formScore = 95;

  if (exercise === 'squat') {
    // Knee angle: Hip -> Knee -> Ankle
    const leftKneeAngle = calculateAngle(landmarks.leftHip, landmarks.leftKnee, landmarks.leftAnkle);
    const rightKneeAngle = calculateAngle(landmarks.rightHip, landmarks.rightKnee, landmarks.rightAnkle);
    primaryAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);

    // Torso angle relative to vertical (hip to shoulder)
    const torsoLean = Math.abs(landmarks.leftShoulder.x - landmarks.leftHip.x);
    secondaryAngle = Math.round(calculateAngle(
      { x: landmarks.leftHip.x, y: landmarks.leftHip.y - 0.5, confidence: 1, name: 'vertical' },
      landmarks.leftHip,
      landmarks.leftShoulder
    ));

    // Stand is ~170-180°, parallel squat is <= 90°
    const standAngle = 170;
    const parallelAngle = 88;
    depthRatio = Math.max(0, Math.min(1, (standAngle - primaryAngle) / (standAngle - parallelAngle)));

    isAtLockout = primaryAngle >= 165;
    isAtBottom = primaryAngle <= 92;

    if (depthRatio > 0.4 && depthRatio < 0.8 && !isAtBottom) {
      flaws.push('Depth: Sink hips lower to reach parallel');
      formScore -= 8;
    }

    // Knee valgus check (knees significantly closer than ankles)
    const kneeWidth = Math.abs(landmarks.leftKnee.x - landmarks.rightKnee.x);
    const ankleWidth = Math.abs(landmarks.leftAnkle.x - landmarks.rightAnkle.x);
    if (kneeWidth < ankleWidth * 0.75 && depthRatio > 0.5) {
      flaws.push('Knee Valgus: Push your knees out in line with toes');
      formScore -= 14;
    }

    // Excessive forward torso lean
    if (torsoLean > 0.22 && depthRatio > 0.6) {
      flaws.push('Torso: Keep chest proud, avoid folding forward');
      formScore -= 10;
    }
  } else if (exercise === 'pushup') {
    // Elbow angle: Shoulder -> Elbow -> Wrist
    const leftElbowAngle = calculateAngle(landmarks.leftShoulder, landmarks.leftElbow, landmarks.leftWrist);
    const rightElbowAngle = calculateAngle(landmarks.rightShoulder, landmarks.rightElbow, landmarks.rightWrist);
    primaryAngle = Math.round((leftElbowAngle + rightElbowAngle) / 2);

    // Spine alignment: Shoulder -> Hip -> Ankle
    const spineAngle = calculateAngle(landmarks.leftShoulder, landmarks.leftHip, landmarks.leftAnkle);
    secondaryAngle = spineAngle;

    const lockoutAngle = 165;
    const bottomAngle = 80;
    depthRatio = Math.max(0, Math.min(1, (lockoutAngle - primaryAngle) / (lockoutAngle - bottomAngle)));

    isAtLockout = primaryAngle >= 160;
    isAtBottom = primaryAngle <= 85;

    // Check spine sagging or piking
    if (spineAngle < 155) {
      flaws.push('Core Sag: Squeeze glutes & brace abs to maintain a straight spine');
      formScore -= 15;
    } else if (spineAngle > 195) {
      flaws.push('Piking Hips: Lower hips to maintain horizontal plank');
      formScore -= 10;
    }
  } else if (exercise === 'bicep_curl') {
    // Elbow angle: Shoulder -> Elbow -> Wrist
    const leftElbowAngle = calculateAngle(landmarks.leftShoulder, landmarks.leftElbow, landmarks.leftWrist);
    primaryAngle = leftElbowAngle;

    // Stretch is ~160°, peak curl is ~45°
    const stretchAngle = 160;
    const peakAngle = 48;
    depthRatio = Math.max(0, Math.min(1, (stretchAngle - primaryAngle) / (stretchAngle - peakAngle)));

    isAtLockout = primaryAngle >= 155; // bottom stretch
    isAtBottom = primaryAngle <= 55;   // top contraction

    // Elbow drift forward
    const elbowDrift = Math.abs(landmarks.leftElbow.x - landmarks.leftShoulder.x);
    if (elbowDrift > 0.12) {
      flaws.push('Elbow Drift: Pin upper arm against your ribs, eliminate swing');
      formScore -= 12;
    }
  } else if (exercise === 'shoulder_press') {
    // Elbow angle: Shoulder -> Elbow -> Wrist
    const leftElbowAngle = calculateAngle(landmarks.leftShoulder, landmarks.leftElbow, landmarks.leftWrist);
    primaryAngle = leftElbowAngle;

    // Bottom is ~80°, Lockout overhead is ~170°
    const bottomAngle = 80;
    const lockoutAngle = 170;
    depthRatio = Math.max(0, Math.min(1, (primaryAngle - bottomAngle) / (lockoutAngle - bottomAngle)));

    isAtBottom = primaryAngle <= 85;
    isAtLockout = primaryAngle >= 165;

    // Core alignment
    const coreAngle = calculateAngle(landmarks.leftShoulder, landmarks.leftHip, landmarks.leftKnee);
    if (coreAngle < 160) {
      flaws.push('Lower Back: Avoid hyper-arching lumbar spine during press');
      formScore -= 12;
    }
  } else {
    // Lunge
    const kneeAngle = calculateAngle(landmarks.leftHip, landmarks.leftKnee, landmarks.leftAnkle);
    primaryAngle = kneeAngle;
    depthRatio = Math.max(0, Math.min(1, (165 - primaryAngle) / (165 - 90)));
    isAtLockout = primaryAngle >= 160;
    isAtBottom = primaryAngle <= 95;
  }

  return {
    primaryAngle,
    secondaryAngle,
    depthRatio,
    isAtBottom,
    isAtLockout,
    formFlaws: flaws,
    formScore: Math.max(40, Math.min(100, formScore)),
  };
}

// Generates dynamic synthetic pose landmarks (for the simulator or when running camera preview)
export function generateSimulatedPose(phaseProgress: number, exercise: ExerciseType): PoseLandmarks {
  // phaseProgress: 0 (top/start) -> 1 (deepest inflection) -> 0 (finish)
  const p = phaseProgress;

  if (exercise === 'squat') {
    // Squatting down: hips sink, knees bend outward and down, chest slightly leans
    const hipY = 0.52 + p * 0.18;
    const kneeY = 0.68 + p * 0.08;
    const kneeOut = 0.03 * p;
    const ankleY = 0.88;
    const shoulderY = 0.28 + p * 0.16;
    const headY = 0.16 + p * 0.15;

    return {
      nose: { x: 0.5, y: headY, confidence: 0.99, name: 'nose' },
      leftShoulder: { x: 0.42, y: shoulderY, confidence: 0.98, name: 'leftShoulder' },
      rightShoulder: { x: 0.58, y: shoulderY, confidence: 0.98, name: 'rightShoulder' },
      leftElbow: { x: 0.38, y: shoulderY + 0.12, confidence: 0.95, name: 'leftElbow' },
      rightElbow: { x: 0.62, y: shoulderY + 0.12, confidence: 0.95, name: 'rightElbow' },
      leftWrist: { x: 0.44, y: shoulderY + 0.05, confidence: 0.92, name: 'leftWrist' },
      rightWrist: { x: 0.56, y: shoulderY + 0.05, confidence: 0.92, name: 'rightWrist' },
      leftHip: { x: 0.44, y: hipY, confidence: 0.99, name: 'leftHip' },
      rightHip: { x: 0.56, y: hipY, confidence: 0.99, name: 'rightHip' },
      leftKnee: { x: 0.41 - kneeOut, y: kneeY, confidence: 0.98, name: 'leftKnee' },
      rightKnee: { x: 0.59 + kneeOut, y: kneeY, confidence: 0.98, name: 'rightKnee' },
      leftAnkle: { x: 0.43, y: ankleY, confidence: 0.97, name: 'leftAnkle' },
      rightAnkle: { x: 0.57, y: ankleY, confidence: 0.97, name: 'rightAnkle' },
    };
  } else if (exercise === 'pushup') {
    // Horizontal body
    const bodyDrop = p * 0.14;
    return {
      nose: { x: 0.26, y: 0.55 + bodyDrop, confidence: 0.95, name: 'nose' },
      leftShoulder: { x: 0.34, y: 0.56 + bodyDrop, confidence: 0.98, name: 'leftShoulder' },
      rightShoulder: { x: 0.36, y: 0.54 + bodyDrop, confidence: 0.98, name: 'rightShoulder' },
      leftElbow: { x: 0.38, y: 0.48 + bodyDrop * 0.4, confidence: 0.95, name: 'leftElbow' },
      rightElbow: { x: 0.40, y: 0.46 + bodyDrop * 0.4, confidence: 0.95, name: 'rightElbow' },
      leftWrist: { x: 0.34, y: 0.70, confidence: 0.99, name: 'leftWrist' },
      rightWrist: { x: 0.36, y: 0.68, confidence: 0.99, name: 'rightWrist' },
      leftHip: { x: 0.55, y: 0.54 + bodyDrop * 0.85, confidence: 0.98, name: 'leftHip' },
      rightHip: { x: 0.56, y: 0.52 + bodyDrop * 0.85, confidence: 0.98, name: 'rightHip' },
      leftKnee: { x: 0.68, y: 0.57 + bodyDrop * 0.4, confidence: 0.96, name: 'leftKnee' },
      rightKnee: { x: 0.69, y: 0.55 + bodyDrop * 0.4, confidence: 0.96, name: 'rightKnee' },
      leftAnkle: { x: 0.82, y: 0.66, confidence: 0.99, name: 'leftAnkle' },
      rightAnkle: { x: 0.83, y: 0.65, confidence: 0.99, name: 'rightAnkle' },
    };
  } else if (exercise === 'bicep_curl') {
    // Standing, forearm curls up
    const wristAngle = Math.PI * 0.5 - p * Math.PI * 0.65;
    const elbowX = 0.44;
    const elbowY = 0.48;
    const wristX = elbowX + Math.cos(wristAngle) * 0.16;
    const wristY = elbowY + Math.sin(wristAngle) * 0.16;

    return {
      nose: { x: 0.5, y: 0.18, confidence: 0.99, name: 'nose' },
      leftShoulder: { x: 0.44, y: 0.32, confidence: 0.98, name: 'leftShoulder' },
      rightShoulder: { x: 0.56, y: 0.32, confidence: 0.98, name: 'rightShoulder' },
      leftElbow: { x: elbowX, y: elbowY, confidence: 0.98, name: 'leftElbow' },
      rightElbow: { x: 0.58, y: 0.48, confidence: 0.98, name: 'rightElbow' },
      leftWrist: { x: wristX, y: wristY, confidence: 0.96, name: 'leftWrist' },
      rightWrist: { x: 0.59, y: 0.64, confidence: 0.96, name: 'rightWrist' },
      leftHip: { x: 0.46, y: 0.55, confidence: 0.99, name: 'leftHip' },
      rightHip: { x: 0.54, y: 0.55, confidence: 0.99, name: 'rightHip' },
      leftKnee: { x: 0.46, y: 0.72, confidence: 0.98, name: 'leftKnee' },
      rightKnee: { x: 0.54, y: 0.72, confidence: 0.98, name: 'rightKnee' },
      leftAnkle: { x: 0.46, y: 0.90, confidence: 0.97, name: 'leftAnkle' },
      rightAnkle: { x: 0.54, y: 0.90, confidence: 0.97, name: 'rightAnkle' },
    };
  } else if (exercise === 'shoulder_press') {
    // Dumbbells pressed from ears to overhead
    const armElev = p; // 0 = at shoulder, 1 = locked out above head
    const wristY = 0.32 - armElev * 0.22;
    const elbowY = 0.42 - armElev * 0.18;

    return {
      nose: { x: 0.5, y: 0.22, confidence: 0.99, name: 'nose' },
      leftShoulder: { x: 0.42, y: 0.34, confidence: 0.98, name: 'leftShoulder' },
      rightShoulder: { x: 0.58, y: 0.34, confidence: 0.98, name: 'rightShoulder' },
      leftElbow: { x: 0.36 + armElev * 0.04, y: elbowY, confidence: 0.96, name: 'leftElbow' },
      rightElbow: { x: 0.64 - armElev * 0.04, y: elbowY, confidence: 0.96, name: 'rightElbow' },
      leftWrist: { x: 0.38 + armElev * 0.03, y: wristY, confidence: 0.95, name: 'leftWrist' },
      rightWrist: { x: 0.62 - armElev * 0.03, y: wristY, confidence: 0.95, name: 'rightWrist' },
      leftHip: { x: 0.45, y: 0.56, confidence: 0.98, name: 'leftHip' },
      rightHip: { x: 0.55, y: 0.56, confidence: 0.98, name: 'rightHip' },
      leftKnee: { x: 0.45, y: 0.74, confidence: 0.98, name: 'leftKnee' },
      rightKnee: { x: 0.55, y: 0.74, confidence: 0.98, name: 'rightKnee' },
      leftAnkle: { x: 0.45, y: 0.91, confidence: 0.97, name: 'leftAnkle' },
      rightAnkle: { x: 0.55, y: 0.91, confidence: 0.97, name: 'rightAnkle' },
    };
  } else {
    // Lunge
    return generateSimulatedPose(p, 'squat');
  }
}

// Render dynamic HUD skeleton over HTML5 canvas
export function drawPoseOnCanvas(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmarks,
  width: number,
  height: number,
  exercise: ExerciseType,
  metric: FormMetric
) {
  const connections: [keyof PoseLandmarks, keyof PoseLandmarks][] = [
    ['nose', 'leftShoulder'],
    ['nose', 'rightShoulder'],
    ['leftShoulder', 'rightShoulder'],
    ['leftShoulder', 'leftElbow'],
    ['leftElbow', 'leftWrist'],
    ['rightShoulder', 'rightElbow'],
    ['rightElbow', 'rightWrist'],
    ['leftShoulder', 'leftHip'],
    ['rightShoulder', 'rightHip'],
    ['leftHip', 'rightHip'],
    ['leftHip', 'leftKnee'],
    ['leftKnee', 'leftAnkle'],
    ['rightHip', 'rightKnee'],
    ['rightKnee', 'rightAnkle'],
  ];

  // Neon color palette based on form score
  const isWarning = metric.formFlaws.length > 0;
  const strokeColor = isWarning ? '#f59e0b' : '#10b981';
  const glowColor = isWarning ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.45)';

  ctx.save();

  // Draw cybernetic tracking lines
  connections.forEach(([ptA, ptB]) => {
    const a = landmarks[ptA];
    const b = landmarks[ptB];
    if (a.confidence > 0.5 && b.confidence > 0.5) {
      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.lineWidth = 4;
      ctx.strokeStyle = strokeColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  });

  // Draw Joint Nodes
  (Object.keys(landmarks) as (keyof PoseLandmarks)[]).forEach((key) => {
    const pt = landmarks[key];
    if (pt.confidence > 0.5) {
      const px = pt.x * width;
      const py = pt.y * height;

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 14;
      ctx.fill();

      // Inner tech dot
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isWarning ? '#d97706' : '#059669';
      ctx.shadowBlur = 0;
      ctx.fill();
    }
  });

  // Draw angle measurement arc at primary joint
  let vertexPt: Keypoint = landmarks.leftKnee;
  if (exercise === 'pushup' || exercise === 'bicep_curl') {
    vertexPt = landmarks.leftElbow;
  } else if (exercise === 'shoulder_press') {
    vertexPt = landmarks.leftElbow;
  }

  const vx = vertexPt.x * width;
  const vy = vertexPt.y * height;

  // Joint angle badge
  ctx.fillStyle = 'rgba(10, 15, 29, 0.85)';
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.5;
  const badgeWidth = 72;
  const badgeHeight = 26;
  const badgeX = vx + 14;
  const badgeY = vy - 14;

  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText(`${metric.primaryAngle}°`, badgeX + 10, badgeY + 18);

  ctx.restore();
}
