export interface EducationArticle {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'mental-health' | 'prevention' | 'general';
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  publishedDate: Date;
  author: string;
  featured: boolean;
}

export interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'mental-health' | 'prevention' | 'general';
  icon: string;
  actionable: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 'tip_1',
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.',
    category: 'nutrition',
    icon: '💧',
    actionable: true,
    difficulty: 'easy',
  },
  {
    id: 'tip_2',
    title: 'Take Regular Breaks',
    description: 'Take a 5-minute break every hour to stretch and rest your eyes, especially when working at a computer.',
    category: 'general',
    icon: '⏰',
    actionable: true,
    difficulty: 'easy',
  },
  {
    id: 'tip_3',
    title: 'Practice Deep Breathing',
    description: 'Take 5 deep breaths when feeling stressed to activate your body\'s relaxation response.',
    category: 'mental-health',
    icon: '🫁',
    actionable: true,
    difficulty: 'easy',
  },
  {
    id: 'tip_4',
    title: 'Eat More Vegetables',
    description: 'Aim for at least 5 servings of colorful vegetables daily for essential vitamins and minerals.',
    category: 'nutrition',
    icon: '🥬',
    actionable: true,
    difficulty: 'medium',
  },
  {
    id: 'tip_5',
    title: 'Get Quality Sleep',
    description: 'Maintain a consistent sleep schedule and aim for 7-9 hours of quality sleep each night.',
    category: 'general',
    icon: '😴',
    actionable: true,
    difficulty: 'medium',
  },
  {
    id: 'tip_6',
    title: 'Walk More',
    description: 'Take the stairs instead of elevators and park farther away to increase daily activity.',
    category: 'exercise',
    icon: '🚶',
    actionable: true,
    difficulty: 'easy',
  },
  {
    id: 'tip_7',
    title: 'Practice Gratitude',
    description: 'Write down 3 things you\'re grateful for each day to improve mental well-being.',
    category: 'mental-health',
    icon: '🙏',
    actionable: true,
    difficulty: 'easy',
  },
  {
    id: 'tip_8',
    title: 'Limit Processed Foods',
    description: 'Reduce consumption of processed foods and focus on whole, natural ingredients.',
    category: 'nutrition',
    icon: '🥗',
    actionable: true,
    difficulty: 'medium',
  },
  {
    id: 'tip_9',
    title: 'Wash Hands Regularly',
    description: 'Wash your hands with soap and water for at least 20 seconds to prevent illness.',
    category: 'prevention',
    icon: '🧼',
    actionable: true,
    difficulty: 'easy',
  },
  {
    id: 'tip_10',
    title: 'Stay Socially Connected',
    description: 'Maintain regular contact with friends and family to support mental health.',
    category: 'mental-health',
    icon: '👥',
    actionable: true,
    difficulty: 'medium',
  },
];

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'article_1',
    title: 'The Complete Guide to Healthy Eating',
    subtitle: 'Learn the fundamentals of nutrition and how to build a balanced diet',
    content: `# The Complete Guide to Healthy Eating

## Introduction
Healthy eating is one of the most important aspects of maintaining good health and preventing chronic diseases. This comprehensive guide will help you understand the basics of nutrition and how to make better food choices.

## Understanding Macronutrients

### Carbohydrates
Carbohydrates are your body's primary energy source. They should make up 45-65% of your daily calories.

**Good sources:**
- Whole grains (brown rice, quinoa, oats)
- Fruits and vegetables
- Legumes and beans

**Avoid:**
- Refined sugars
- White bread and pasta
- Sugary drinks

### Proteins
Proteins are essential for building and repairing tissues. Aim for 10-35% of your daily calories.

**Good sources:**
- Lean meats (chicken, turkey, fish)
- Plant-based proteins (tofu, tempeh, legumes)
- Dairy products (Greek yogurt, cottage cheese)

### Fats
Healthy fats are crucial for brain function and hormone production. They should comprise 20-35% of your calories.

**Good sources:**
- Avocados
- Nuts and seeds
- Olive oil
- Fatty fish (salmon, mackerel)

## Building a Balanced Plate

### The Plate Method
1. **Half your plate:** Non-starchy vegetables
2. **Quarter your plate:** Lean protein
3. **Quarter your plate:** Whole grains or starchy vegetables
4. **Add:** A serving of healthy fat

## Hydration
Water is essential for every bodily function. Aim for:
- 8-10 glasses of water daily
- More during exercise or hot weather
- Limit sugary drinks and excessive caffeine

## Meal Planning Tips
1. Plan your meals weekly
2. Prep ingredients in advance
3. Keep healthy snacks on hand
4. Listen to your hunger cues
5. Practice mindful eating

## Common Mistakes to Avoid
- Skipping meals
- Eating too fast
- Not reading nutrition labels
- Following fad diets
- Ignoring portion sizes

## Conclusion
Healthy eating doesn't have to be complicated. Focus on whole, minimally processed foods, stay hydrated, and listen to your body's needs. Small, consistent changes lead to lasting health improvements.`,
    category: 'nutrition',
    readTime: 8,
    difficulty: 'beginner',
    tags: ['nutrition', 'diet', 'healthy-eating', 'macronutrients'],
    publishedDate: new Date('2024-01-15'),
    author: 'Dr. Sarah Johnson',
    featured: true,
  },
  {
    id: 'article_2',
    title: 'Exercise for Beginners: Start Your Fitness Journey',
    subtitle: 'Everything you need to know to begin exercising safely and effectively',
    content: `# Exercise for Beginners: Start Your Fitness Journey

## Why Exercise Matters
Regular physical activity is one of the best things you can do for your health. It helps:
- Strengthen your heart and lungs
- Build muscle and bone strength
- Improve mental health
- Boost energy levels
- Reduce disease risk

## Types of Exercise

### Cardiovascular Exercise
Also known as "cardio," this gets your heart pumping:
- Walking
- Running
- Cycling
- Swimming
- Dancing

**Goal:** 150 minutes of moderate-intensity cardio per week

### Strength Training
Builds muscle and bone strength:
- Bodyweight exercises (push-ups, squats)
- Resistance bands
- Free weights
- Machines

**Goal:** 2-3 sessions per week

### Flexibility and Balance
Improves range of motion and prevents falls:
- Yoga
- Stretching
- Tai chi
- Pilates

## Getting Started

### Start Slow
- Begin with 10-15 minutes of activity
- Gradually increase duration and intensity
- Listen to your body
- Rest when needed

### Choose Activities You Enjoy
- Try different types of exercise
- Find a workout buddy
- Join a class or group
- Make it social

### Set Realistic Goals
- Start with small, achievable goals
- Track your progress
- Celebrate milestones
- Adjust goals as you improve

## Safety Tips
- Warm up before exercising
- Cool down afterward
- Stay hydrated
- Use proper form
- Don't ignore pain
- Consult a doctor if you have health concerns

## Common Beginner Mistakes
1. Doing too much too soon
2. Skipping warm-ups
3. Poor form
4. Not resting enough
5. Comparing yourself to others

## Building a Routine
1. **Monday:** Cardio (30 minutes)
2. **Tuesday:** Strength training (20 minutes)
3. **Wednesday:** Rest or light activity
4. **Thursday:** Cardio (30 minutes)
5. **Friday:** Strength training (20 minutes)
6. **Saturday:** Fun activity (hiking, sports)
7. **Sunday:** Rest or gentle stretching

## Staying Motivated
- Set specific, measurable goals
- Track your progress
- Find an accountability partner
- Reward yourself for milestones
- Focus on how exercise makes you feel

## Conclusion
Starting an exercise routine can feel overwhelming, but remember that every expert was once a beginner. Start small, be consistent, and gradually build up your fitness level. Your future self will thank you!`,
    category: 'exercise',
    readTime: 6,
    difficulty: 'beginner',
    tags: ['exercise', 'fitness', 'beginner', 'workout'],
    publishedDate: new Date('2024-01-20'),
    author: 'Mike Chen, Personal Trainer',
    featured: true,
  },
  {
    id: 'article_3',
    title: 'Managing Stress for Better Health',
    subtitle: 'Practical strategies to reduce stress and improve your well-being',
    content: `# Managing Stress for Better Health

## Understanding Stress
Stress is your body's response to challenges or demands. While some stress is normal and even beneficial, chronic stress can negatively impact your health.

### Types of Stress
- **Acute stress:** Short-term response to immediate challenges
- **Chronic stress:** Long-term, ongoing stress that can harm health
- **Eustress:** Positive stress that motivates and energizes

## Effects of Chronic Stress

### Physical Effects
- Headaches and muscle tension
- Sleep problems
- Digestive issues
- Weakened immune system
- High blood pressure
- Increased risk of heart disease

### Mental Effects
- Anxiety and depression
- Irritability and mood swings
- Difficulty concentrating
- Memory problems
- Feeling overwhelmed

## Stress Management Techniques

### Breathing Exercises
**4-7-8 Breathing:**
1. Inhale for 4 counts
2. Hold for 7 counts
3. Exhale for 8 counts
4. Repeat 4 times

### Progressive Muscle Relaxation
1. Tense each muscle group for 5 seconds
2. Release and notice the relaxation
3. Work through your entire body
4. Focus on the contrast between tension and relaxation

### Mindfulness and Meditation
- Practice daily meditation (even 5-10 minutes)
- Use mindfulness apps
- Focus on the present moment
- Accept thoughts without judgment

### Physical Activity
- Regular exercise reduces stress hormones
- Even a 10-minute walk can help
- Choose activities you enjoy
- Aim for 30 minutes most days

### Healthy Lifestyle Choices
- Maintain a regular sleep schedule
- Eat a balanced diet
- Limit caffeine and alcohol
- Stay hydrated
- Avoid smoking

## Time Management
- Prioritize tasks
- Break large projects into smaller steps
- Learn to say no
- Delegate when possible
- Use a planner or calendar

## Social Support
- Talk to friends and family
- Join support groups
- Seek professional help when needed
- Maintain healthy relationships
- Help others (volunteering can reduce stress)

## Relaxation Techniques
- Take warm baths
- Listen to calming music
- Practice yoga or tai chi
- Spend time in nature
- Engage in hobbies

## When to Seek Help
Seek professional help if you experience:
- Persistent anxiety or depression
- Thoughts of self-harm
- Inability to function normally
- Substance abuse
- Severe sleep problems

## Building Resilience
- Develop a positive mindset
- Practice gratitude
- Learn from challenges
- Maintain perspective
- Build strong relationships

## Conclusion
Stress is a normal part of life, but it doesn't have to control you. By implementing these strategies and seeking help when needed, you can manage stress effectively and improve your overall health and well-being.`,
    category: 'mental-health',
    readTime: 7,
    difficulty: 'intermediate',
    tags: ['stress', 'mental-health', 'wellness', 'relaxation'],
    publishedDate: new Date('2024-01-25'),
    author: 'Dr. Emily Rodriguez',
    featured: false,
  },
  {
    id: 'article_4',
    title: 'Preventing Common Illnesses',
    subtitle: 'Simple steps to boost your immune system and stay healthy',
    content: `# Preventing Common Illnesses

## The Immune System
Your immune system is your body's defense against infections and diseases. Keeping it strong is key to preventing common illnesses.

## Lifestyle Factors That Boost Immunity

### Nutrition
**Immune-Boosting Foods:**
- Citrus fruits (vitamin C)
- Red bell peppers
- Broccoli
- Garlic
- Ginger
- Spinach
- Yogurt (probiotics)
- Almonds (vitamin E)

**Avoid:**
- Excessive sugar
- Processed foods
- Alcohol in excess

### Sleep
- Aim for 7-9 hours nightly
- Maintain consistent sleep schedule
- Create a relaxing bedtime routine
- Keep bedroom cool and dark

### Exercise
- Regular moderate exercise boosts immunity
- 30 minutes most days
- Don't overdo it (excessive exercise can weaken immunity)
- Include both cardio and strength training

### Stress Management
- Chronic stress weakens the immune system
- Practice relaxation techniques
- Maintain work-life balance
- Seek support when needed

## Hygiene Practices

### Hand Hygiene
- Wash hands frequently with soap and water
- Use hand sanitizer when soap isn't available
- Avoid touching your face
- Cover coughs and sneezes

### Food Safety
- Cook meats thoroughly
- Wash fruits and vegetables
- Avoid cross-contamination
- Refrigerate perishables promptly

### Environmental Hygiene
- Clean and disinfect surfaces regularly
- Maintain good ventilation
- Avoid close contact with sick people
- Stay home when you're ill

## Vaccinations
- Keep up with recommended vaccines
- Annual flu vaccine
- COVID-19 vaccines as recommended
- Other vaccines based on age and health status

## Supplements
**Consider (with doctor's approval):**
- Vitamin D
- Vitamin C
- Zinc
- Probiotics
- Elderberry

**Note:** Supplements don't replace a healthy diet

## Seasonal Health Tips

### Winter
- Stay warm and dry
- Moisturize skin
- Use humidifiers
- Get sunlight exposure

### Summer
- Stay hydrated
- Protect from sun exposure
- Be aware of heat-related illnesses
- Practice water safety

## When You're Sick
- Rest and stay hydrated
- Use over-the-counter medications as directed
- Seek medical attention if symptoms worsen
- Stay home to prevent spreading illness

## Building Long-Term Health
- Regular health checkups
- Manage chronic conditions
- Maintain healthy weight
- Don't smoke
- Limit alcohol consumption

## Conclusion
Prevention is always better than cure. By maintaining a healthy lifestyle, practicing good hygiene, and staying up-to-date with vaccinations, you can significantly reduce your risk of common illnesses and keep your immune system strong.`,
    category: 'prevention',
    readTime: 5,
    difficulty: 'beginner',
    tags: ['prevention', 'immunity', 'health', 'wellness'],
    publishedDate: new Date('2024-01-30'),
    author: 'Dr. James Wilson',
    featured: false,
  },
];

export const getTipsByCategory = (category: HealthTip['category']): HealthTip[] => {
  return HEALTH_TIPS.filter(tip => tip.category === category);
};

export const getFeaturedArticles = (): EducationArticle[] => {
  return EDUCATION_ARTICLES.filter(article => article.featured);
};

export const getArticlesByCategory = (category: EducationArticle['category']): EducationArticle[] => {
  return EDUCATION_ARTICLES.filter(article => article.category === category);
};

export const getRandomTip = (): HealthTip => {
  const randomIndex = Math.floor(Math.random() * HEALTH_TIPS.length);
  return HEALTH_TIPS[randomIndex];
};
