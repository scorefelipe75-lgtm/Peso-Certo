'use client'

import { useState, useEffect } from 'react'
import { Heart, Target, TrendingDown, Calendar, Award, ChevronRight, Check, Scale, Activity, Apple, Droplets, Moon, User, Zap, Home, BarChart3, Settings, AlertTriangle, Crown, ArrowLeft, Sparkles, Trophy, Flame, Coffee, Wine, Salad, Fish, Leaf, Loader2, ChefHat, Dumbbell, Clock, Utensils, TrendingUp, Brain, Battery, Globe, ThumbsUp, MessageCircle, Share2, MapPin, Star } from 'lucide-react'

// Tipos
interface UserData {
  name: string
  age: number
  gender: string
  currentWeight: number
  targetWeight: number
  height: number
  activityLevel: string
  goal: string
  dietPreference: string
  bodyType: string
  lifestyle: string
  sleepHours: string
  bellyType: string
  waterIntake: string
  dietType: string
  timeAvailable: string
  habits: string[]
  lunchChoice: string
  cravingTime: string
  simpleGoals: string[]
}

interface DailyProgress {
  date: string
  weight: number
  waterGlasses: number
  exerciseMinutes: number
  caloriesConsumed: number
  mood: string
}

interface PersonalizedPlan {
  dailyCalories: number
  proteinGrams: number
  carbsGrams: number
  fatsGrams: number
  waterGoal: number
  exerciseMinutes: number
  estimatedWeeks: number
  bmi: number
  bmiCategory: string
  tips: string[]
  recipes: Array<{ name: string; calories: number; time: string; icon: string }>
  exercises: Array<{ name: string; duration: string; calories: number; icon: string }>
}

export default function WeightLossApp() {
  // Estados principais
  const [step, setStep] = useState<'welcome' | 'welcome-map' | 'onboarding' | 'loading' | 'adapting' | 'bmi-result' | 'subscription' | 'dashboard'>('welcome')
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [userData, setUserData] = useState<Partial<UserData>>({})
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null)
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])
  const [todayProgress, setTodayProgress] = useState<Partial<DailyProgress>>({
    waterGlasses: 0,
    exerciseMinutes: 0,
    caloriesConsumed: 0
  })
  const [activeTab, setActiveTab] = useState<'home' | 'progress' | 'settings'>('home')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [adaptingProgress, setAdaptingProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos em segundos

  // Timer de oferta
  useEffect(() => {
    if (step === 'subscription') {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Carregar dados do localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('weightLossUserData')
    const savedPlan = localStorage.getItem('weightLossPlan')
    const savedProgress = localStorage.getItem('weightLossProgress')

    if (savedUserData && savedPlan) {
      setUserData(JSON.parse(savedUserData))
      setPlan(JSON.parse(savedPlan))
      setStep('dashboard')
    }

    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setDailyProgress(progress)
      
      const today = new Date().toISOString().split('T')[0]
      const todayData = progress.find((p: DailyProgress) => p.date === today)
      if (todayData) {
        setTodayProgress(todayData)
      }
    }
  }, [])

  // Animação de loading
  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep('adapting'), 500)
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step])

  // Animação de adaptação
  useEffect(() => {
    if (step === 'adapting') {
      const interval = setInterval(() => {
        setAdaptingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep('bmi-result'), 500)
            return 100
          }
          return prev + 1
        })
      }, 80)
      return () => clearInterval(interval)
    }
  }, [step])

  // Salvar dados no localStorage
  const saveData = () => {
    localStorage.setItem('weightLossUserData', JSON.stringify(userData))
    if (plan) {
      localStorage.setItem('weightLossPlan', JSON.stringify(plan))
    }
    localStorage.setItem('weightLossProgress', JSON.stringify(dailyProgress))
  }

  // Calcular IMC
  const calculateBMI = (weight: number, height: number): { bmi: number; category: string; color: string } => {
    const bmi = weight / ((height / 100) ** 2)
    let category = ''
    let color = ''

    if (bmi < 18.5) {
      category = 'Abaixo do peso'
      color = 'text-blue-400'
    } else if (bmi < 25) {
      category = 'Peso normal'
      color = 'text-green-400'
    } else if (bmi < 30) {
      category = 'Sobrepeso'
      color = 'text-yellow-400'
    } else if (bmi < 35) {
      category = 'Obesidade Grau I'
      color = 'text-orange-400'
    } else {
      category = 'Obesidade Grau II/III'
      color = 'text-red-400'
    }

    return { bmi: Number(bmi.toFixed(1)), category, color }
  }

  // Gerar plano personalizado
  const generatePlan = (): PersonalizedPlan => {
    const weight = userData.currentWeight || 70
    const target = userData.targetWeight || 65
    const height = userData.height || 170
    const age = userData.age || 30
    const gender = userData.gender || 'female'
    const activityLevel = userData.activityLevel || 'moderate'

    // Calcular IMC
    const { bmi, category } = calculateBMI(weight, height)

    // Cálculo de TMB (Taxa Metabólica Basal)
    let bmr = gender === 'male'
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

    // Fator de atividade
    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }

    const tdee = bmr * (activityFactors[activityLevel] || 1.55)
    const dailyCalories = Math.round(tdee - 500)

    // Macros
    const proteinGrams = Math.round(weight * 2)
    const fatsGrams = Math.round((dailyCalories * 0.25) / 9)
    const carbsGrams = Math.round((dailyCalories - (proteinGrams * 4) - (fatsGrams * 9)) / 4)

    // Estimativa de tempo
    const weightToLose = weight - target
    const estimatedWeeks = Math.ceil(weightToLose / 0.5)

    // Receitas personalizadas
    const recipes = [
      { name: 'Omelete de claras com espinafre', calories: 180, time: '10 min', icon: '🍳' },
      { name: 'Salada de frango grelhado', calories: 320, time: '15 min', icon: '🥗' },
      { name: 'Salmão com legumes', calories: 380, time: '20 min', icon: '🐟' },
      { name: 'Smoothie verde detox', calories: 150, time: '5 min', icon: '🥤' },
      { name: 'Peito de frango com batata doce', calories: 420, time: '25 min', icon: '🍗' },
      { name: 'Iogurte grego com frutas', calories: 200, time: '5 min', icon: '🥣' }
    ]

    // Exercícios personalizados
    const exercises = [
      { name: 'Caminhada rápida', duration: '30 min', calories: 150, icon: '🚶' },
      { name: 'Corrida leve', duration: '20 min', calories: 200, icon: '🏃' },
      { name: 'Treino HIIT', duration: '15 min', calories: 180, icon: '💪' },
      { name: 'Yoga', duration: '30 min', calories: 120, icon: '🧘' },
      { name: 'Natação', duration: '30 min', calories: 250, icon: '🏊' },
      { name: 'Ciclismo', duration: '40 min', calories: 300, icon: '🚴' }
    ]

    // Dicas personalizadas baseadas nas respostas
    const tips = [
      '💧 Beba água antes das refeições',
      '🥗 Comece refeições com salada',
      '🚶 Caminhe 10min após comer',
      '😴 Durma 7-8 horas por noite',
      '🍎 Tenha frutas sempre à mão',
      '🏋️ Treino de força 2-3x/semana',
      '🧘 Pratique mindfulness ao comer',
      '📱 Evite telas antes de dormir'
    ]

    // Adicionar dicas personalizadas baseadas no tipo de barriga
    if (userData.bellyType === 'stress') {
      tips.unshift('🧘 Pratique meditação diária para reduzir cortisol')
    } else if (userData.bellyType === 'gluten') {
      tips.unshift('🌾 Considere reduzir glúten gradualmente')
    } else if (userData.bellyType === 'alcohol') {
      tips.unshift('🚫 Reduza consumo de álcool progressivamente')
    }

    // Adicionar dicas baseadas no consumo de água
    if (userData.waterIntake === 'coffee-tea') {
      tips.unshift('💧 Alterne café/chá com água pura')
    } else if (userData.waterIntake === 'less-2') {
      tips.unshift('💧 Aumente gradualmente para 6-8 copos/dia')
    }

    // Adicionar dicas baseadas nos hábitos
    if (userData.habits?.includes('drink-casually')) {
      tips.unshift('🍷 Limite bebidas alcoólicas a 1-2x por semana')
    }
    if (userData.habits?.includes('eat-late')) {
      tips.unshift('🌙 Evite comer 3h antes de dormir')
    }
    if (userData.habits?.includes('love-sweets')) {
      tips.unshift('🍫 Substitua doces por frutas gradualmente')
    }

    // Adicionar dicas baseadas no horário de desejos
    if (userData.cravingTime === 'night') {
      tips.unshift('🌙 Prepare lanches saudáveis para a noite')
    } else if (userData.cravingTime === 'afternoon') {
      tips.unshift('☕ Tenha snacks proteicos para a tarde')
    }

    return {
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      waterGoal: 8,
      exerciseMinutes: activityLevel === 'sedentary' ? 20 : 30,
      estimatedWeeks,
      bmi,
      bmiCategory: category,
      tips: tips.slice(0, 6),
      recipes,
      exercises
    }
  }

  // Finalizar onboarding
  const completeOnboarding = () => {
    const newPlan = generatePlan()
    setPlan(newPlan)
    setStep('loading')
    saveData()
  }

  // Atualizar progresso diário
  const updateTodayProgress = (field: keyof DailyProgress, value: any) => {
    const today = new Date().toISOString().split('T')[0]
    const updated = { ...todayProgress, [field]: value, date: today }
    setTodayProgress(updated)

    const newProgress = dailyProgress.filter(p => p.date !== today)
    newProgress.push(updated as DailyProgress)
    setDailyProgress(newProgress)
    localStorage.setItem('weightLossProgress', JSON.stringify(newProgress))
  }

  // Resetar aplicativo
  const resetApp = () => {
    localStorage.clear()
    setStep('welcome')
    setOnboardingStep(0)
    setUserData({})
    setPlan(null)
    setDailyProgress([])
    setTodayProgress({ waterGlasses: 0, exerciseMinutes: 0, caloriesConsumed: 0 })
    setLoadingProgress(0)
    setAdaptingProgress(0)
  }

  // Toggle hábito (para perguntas com múltipla escolha)
  const toggleHabit = (habit: string) => {
    const currentHabits = userData.habits || []
    const newHabits = currentHabits.includes(habit)
      ? currentHabits.filter(h => h !== habit)
      : [...currentHabits, habit]
    setUserData({ ...userData, habits: newHabits })
  }

  // Toggle objetivo SIMPLE (para pergunta com múltipla escolha)
  const toggleSimpleGoal = (goal: string) => {
    const currentGoals = userData.simpleGoals || []
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal]
    setUserData({ ...userData, simpleGoals: newGoals })
  }

  // Perguntas do onboarding - Estilo SIMPLE com novas perguntas
  const questions = [
    {
      id: 'simpleGoals',
      question: 'Com o Peso Certo, eu gostaria de:',
      subtitle: 'Selecione todos os seus objetivos',
      type: 'multi-select',
      options: [
        { value: 'self-esteem', label: 'Aumentar minha autoestima', icon: '✨' },
        { value: 'health', label: 'Melhorar minha saúde', icon: '❤️' },
        { value: 'confidence', label: 'Ganhar confiança', icon: '💪' },
        { value: 'habits', label: 'Criar hábitos saudáveis', icon: '🎯' },
        { value: 'weight', label: 'Perder peso', icon: '⚖️' }
      ]
    },
    {
      id: 'cravingTime',
      question: 'Quando você mais sente desejo por guloseimas?',
      subtitle: 'Isso nos ajuda a personalizar suas dicas',
      type: 'simple-select',
      options: [
        { value: 'morning', label: 'Manhã', icon: '🌅' },
        { value: 'afternoon', label: 'Tarde', icon: '☀️' },
        { value: 'night', label: 'Noite', icon: '🌙' },
        { value: 'late-night', label: 'Madrugada', icon: '🌃' },
        { value: 'none', label: 'Não sinto', icon: '😊' }
      ]
    },
    {
      id: 'goal',
      question: 'No que você quer focar?',
      subtitle: 'Escolha seu objetivo principal',
      type: 'simple-select',
      options: [
        { value: 'weight', label: 'Perder peso', icon: '⚖️' },
        { value: 'health', label: 'Melhorar saúde', icon: '❤️' },
        { value: 'confidence', label: 'Aumentar autoestima', icon: '✨' }
      ]
    },
    {
      id: 'gender',
      question: 'Qual é o seu gênero?',
      subtitle: 'Nós usaremos sua resposta para personalizar o conteúdo que você vai receber',
      type: 'simple-select',
      options: [
        { value: 'female', label: 'Mulher', icon: '👩' },
        { value: 'male', label: 'Homem', icon: '👨' },
        { value: 'non-binary', label: 'Não binário', icon: '🧑' },
        { value: 'prefer-not', label: 'Prefiro não responder', icon: '🤐' }
      ]
    },
    {
      id: 'age',
      question: 'Qual é a sua idade?',
      subtitle: 'Selecione sua faixa etária',
      type: 'age-select',
      options: [
        { value: 25, label: '18–29 anos', image: '👶' },
        { value: 35, label: '30–39 anos', image: '🧑' },
        { value: 45, label: '40–49 anos', image: '👨' },
        { value: 55, label: '50–59 anos', image: '👴' },
        { value: 65, label: '60+ anos', image: '👵' }
      ]
    },
    {
      id: 'habits',
      question: 'Você tem algum desses hábitos?',
      subtitle: 'Selecione todos que se aplicam',
      type: 'multi-select',
      options: [
        { value: 'drink-casually', label: 'Eu bebo casualmente', icon: '🍷' },
        { value: 'eat-late', label: 'Eu como tarde da noite', icon: '🌙' },
        { value: 'love-sweets', label: 'Adoro comer doces', icon: '🍰' },
        { value: 'need-soda', label: 'Não consigo viver sem refrigerantes', icon: '🥤' },
        { value: 'salty-crunchy', label: 'Eu gosto de coisas salgadas e crocantes', icon: '🥨' }
      ]
    },
    {
      id: 'lunchChoice',
      question: 'Qual das opções abaixo descreve melhor a sua escolha de almoço?',
      subtitle: 'A combinação de alimentos específicos têm um grande impacto na sua habilidade de queimar gorduras',
      type: 'simple-select',
      options: [
        { value: 'sandwiches', label: 'Eu costumo comer sanduíches/wraps', icon: '🥪' },
        { value: 'salad', label: 'Um prato de salada ou legumes variados', icon: '🥗' },
        { value: 'protein', label: 'Proteínas magras e um acompanhamento', icon: '🍗' },
        { value: 'fast-food', label: 'Costumo comer fast food', icon: '🍔' }
      ]
    },
    {
      id: 'waterIntake',
      question: 'Quantos copos d\'água você bebe por dia?',
      subtitle: 'Hidratação é fundamental para perda de peso',
      type: 'water-select',
      options: [
        { value: 'coffee-tea', label: 'Eu só tomo café ou chá', icon: '☕' },
        { value: 'less-2', label: 'Cerca de 2 copos d\'água', icon: '💧' },
        { value: '2-6', label: 'Entre 2 e 6 copos d\'água', icon: '💦' },
        { value: 'more-6', label: 'Mais de 6 copos d\'água', icon: '🌊' }
      ]
    },
    {
      id: 'dietType',
      question: 'Você segue algum destes tipos de alimentação?',
      subtitle: 'Isso nos ajuda a personalizar suas recomendações',
      type: 'diet-select',
      options: [
        { value: 'none', label: 'Não', icon: '🙂' },
        { value: 'low-carb', label: 'Baixa em carboidratos', icon: '🥗' },
        { value: 'vegetarian', label: 'Vegetariana', icon: '🥦' },
        { value: 'vegan', label: 'Vegana', icon: '🌱' },
        { value: 'pescatarian', label: 'Pescetariana', icon: '🐟' }
      ]
    },
    {
      id: 'bellyType',
      question: 'Qual é o seu tipo de barriga?',
      subtitle: 'Isso nos ajuda a personalizar seu plano',
      type: 'belly-select',
      options: [
        { value: 'stress', label: 'Barriga de estresse', image: '😰' },
        { value: 'gluten', label: 'Barriga de glúten', image: '🍞' },
        { value: 'alcohol', label: 'Barriga de álcool', image: '🍺' },
        { value: 'hormonal', label: 'Barriga hormonal', image: '⚖️' },
        { value: 'bloated', label: 'Barriga inchada', image: '💨' }
      ]
    },
    {
      id: 'timeAvailable',
      question: 'Quanto tempo você tem para si diariamente?',
      subtitle: 'Vamos adaptar seu plano à sua rotina',
      type: 'time-select',
      options: [
        { value: 'minimal', label: 'Eu mal tenho tempo para mim', icon: '⏰' },
        { value: 'moderate', label: 'Tenho uma vida atarefada, mas tento descansar um pouco', icon: '🕐' },
        { value: 'flexible', label: 'Meus horários são flexíveis', icon: '🕰️' }
      ]
    },
    {
      id: 'sleepHours',
      question: 'Quanto tempo você costuma dormir?',
      subtitle: 'O sono é fundamental para perda de peso',
      type: 'simple-select',
      options: [
        { value: 'less-5', label: 'Descanso mínimo (menos de 5 horas)', icon: '😴' },
        { value: '5-6', label: 'Às vezes eu fecho os olhos (entre 5-6 horas)', icon: '😪' },
        { value: '7-8', label: 'Eu durmo muito e bem (entre 7 e 8 horas)', icon: '😊' },
        { value: 'more-8', label: 'Eu durmo como um bebê (mais de 8 horas)', icon: '😌' }
      ]
    },
    {
      id: 'height',
      question: 'Qual é a sua altura?',
      subtitle: 'Digite em centímetros',
      type: 'number',
      placeholder: 'Ex: 170'
    },
    {
      id: 'currentWeight',
      question: 'Qual é o seu peso atual?',
      subtitle: 'Digite em quilogramas',
      type: 'number',
      placeholder: 'Ex: 75'
    },
    {
      id: 'targetWeight',
      question: 'Qual é o seu peso desejado?',
      subtitle: 'Digite em quilogramas',
      type: 'number',
      placeholder: 'Ex: 65'
    },
    {
      id: 'activityLevel',
      question: 'Qual é o seu nível de atividade física?',
      subtitle: 'Seja honesto, isso é importante para seu plano',
      type: 'simple-select',
      options: [
        { value: 'sedentary', label: 'Sedentário - Pouco ou nenhum exercício', icon: '🛋️' },
        { value: 'light', label: 'Leve - 1-3 dias por semana', icon: '🚶' },
        { value: 'moderate', label: 'Moderado - 3-5 dias por semana', icon: '🏃' },
        { value: 'active', label: 'Ativo - 6-7 dias por semana', icon: '💪' }
      ]
    }
  ]

  const currentQuestion = questions[onboardingStep]

  // Renderizar tela de boas-vindas inicial - Estilo SIMPLE com cores verdes
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
          {/* Logo redonda com imagem de fundo */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] blur-3xl opacity-30 animate-pulse"></div>
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5688a49a-6930-4b3e-a589-430d02aab575.png" 
                  alt="Peso Certo Logo" 
                  className="relative w-32 h-32 rounded-full object-cover shadow-2xl shadow-green-500/50"
                />
              </div>
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] bg-clip-text text-transparent mb-3">
                Peso Certo
              </h1>
              <p className="text-xl text-gray-300">
                Seu plano, seu corpo, seus resultados.
              </p>
            </div>
          </div>

          {/* Botão CTA */}
          <button
            onClick={() => setStep('welcome-map')}
            className="w-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] text-white py-6 px-8 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Começar minha jornada
            <ChevronRight className="w-6 h-6" />
          </button>

          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-[#A4D65E]" />
            Leva apenas 2 minutos
          </p>
        </div>
      </div>
    )
  }

  // Renderizar tela de boas-vindas com mapa
  if (step === 'welcome-map') {
    const userAvatars = [
      { top: '20%', left: '15%', reactions: { likes: 234, comments: 45 } },
      { top: '35%', left: '70%', reactions: { likes: 567, comments: 89 } },
      { top: '60%', left: '25%', reactions: { likes: 892, comments: 123 } },
      { top: '45%', left: '85%', reactions: { likes: 445, comments: 67 } },
      { top: '75%', left: '50%', reactions: { likes: 678, comments: 91 } },
      { top: '25%', left: '45%', reactions: { likes: 321, comments: 54 } }
    ]

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5688a49a-6930-4b3e-a589-430d02aab575.png" 
              alt="Peso Certo Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white font-bold text-lg bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] bg-clip-text text-transparent">Peso Certo</span>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Mapa-múndi com avatares */}
          <div className="relative w-full max-w-2xl aspect-video mb-8">
            {/* Fundo do mapa */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-[#3A9D23]/20 rounded-3xl border border-white/10 backdrop-blur-sm">
              <Globe className="w-full h-full text-[#A4D65E]/10 p-8" />
            </div>

            {/* Avatares de usuários */}
            {userAvatars.map((avatar, index) => (
              <div
                key={index}
                className="absolute animate-pulse"
                style={{ top: avatar.top, left: avatar.left }}
              >
                <div className="relative group">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A4D65E] to-[#3A9D23] flex items-center justify-center shadow-lg shadow-green-500/50 cursor-pointer hover:scale-110 transition-all">
                    <User className="w-6 h-6 text-white" />
                  </div>

                  {/* Reações (aparecem no hover) */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-2xl whitespace-nowrap">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-red-400">
                          <Heart className="w-3 h-3 fill-current" />
                          {avatar.reactions.likes}
                        </span>
                        <span className="flex items-center gap-1 text-[#A4D65E]">
                          <MessageCircle className="w-3 h-3" />
                          {avatar.reactions.comments}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ping animado */}
                  <div className="absolute inset-0 rounded-full bg-[#A4D65E] animate-ping opacity-20"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Texto principal */}
          <div className="text-center space-y-4 max-w-lg z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Junte-se a milhares de pessoas
            </h2>
            <p className="text-xl text-gray-300">
              que já transformaram suas vidas com o Peso Certo
            </p>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-[#A4D65E]">50K+</div>
                <div className="text-xs text-gray-400 mt-1">Usuários ativos</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-green-400">95%</div>
                <div className="text-xs text-gray-400 mt-1">Satisfação</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-[#3A9D23]">12kg</div>
                <div className="text-xs text-gray-400 mt-1">Média perdida</div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="p-4 bg-[#1a3a1f]/80 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={() => setStep('welcome')}
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={() => setStep('onboarding')}
              className="flex-1 bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] text-white py-4 px-8 rounded-xl font-bold shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Avançar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar onboarding - Estilo SIMPLE com cores verdes
  if (step === 'onboarding') {
    const progress = ((onboardingStep + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] flex flex-col">
        {/* Header com logo e progresso */}
        <div className="bg-[#1a3a1f]/80 backdrop-blur-xl p-4 border-b border-white/10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5688a49a-6930-4b3e-a589-430d02aab575.png" 
                  alt="Peso Certo Logo" 
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-white font-bold text-lg bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] bg-clip-text text-transparent">Peso Certo</span>
              </div>
              <span className="text-gray-400 text-sm font-medium">{onboardingStep + 1}/{questions.length}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Conteúdo da pergunta */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full space-y-8 py-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {currentQuestion.question}
              </h2>
              <p className="text-gray-400 text-base md:text-lg">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Input baseado no tipo */}
            {currentQuestion.type === 'number' && (
              <div className="max-w-md mx-auto">
                <input
                  type="number"
                  placeholder={currentQuestion.placeholder}
                  value={userData[currentQuestion.id as keyof UserData] || ''}
                  onChange={(e) => setUserData({ ...userData, [currentQuestion.id]: Number(e.target.value) })}
                  className="w-full px-6 py-6 text-2xl bg-white/5 text-white border-2 border-white/10 rounded-2xl focus:border-[#A4D65E] focus:outline-none transition-all text-center font-semibold backdrop-blur-xl"
                />
              </div>
            )}

            {currentQuestion.type === 'multi-select' && (
              <div className="space-y-3 max-w-2xl mx-auto">
                {currentQuestion.options?.map((option) => {
                  const isSelected = currentQuestion.id === 'simpleGoals'
                    ? (userData.simpleGoals || []).includes(option.value)
                    : (userData.habits || []).includes(option.value)
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (currentQuestion.id === 'simpleGoals') {
                          toggleSimpleGoal(option.value)
                        } else {
                          toggleHabit(option.value)
                        }
                      }}
                      className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                        isSelected
                          ? 'border-[#A4D65E] bg-green-500/10 shadow-lg shadow-green-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {option.icon && <div className="text-3xl">{option.icon}</div>}
                      <span className="text-white font-medium text-base text-left flex-1">{option.label}</span>
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                        isSelected ? 'bg-[#A4D65E] border-[#A4D65E]' : 'border-white/30'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {(currentQuestion.type === 'simple-select' || currentQuestion.type === 'water-select' || currentQuestion.type === 'diet-select' || currentQuestion.type === 'time-select') && (
              <div className="space-y-3 max-w-2xl mx-auto">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setUserData({ ...userData, [currentQuestion.id]: option.value })}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      userData[currentQuestion.id as keyof UserData] === option.value
                        ? 'border-[#A4D65E] bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {option.icon && <div className="text-3xl">{option.icon}</div>}
                    <span className="text-white font-medium text-base text-left flex-1">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'age-select' && (
              <div className="space-y-3 max-w-2xl mx-auto">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setUserData({ ...userData, [currentQuestion.id]: option.value })}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      userData[currentQuestion.id as keyof UserData] === option.value
                        ? 'border-[#A4D65E] bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-4xl">{option.image}</div>
                    <span className="text-white font-medium text-base">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'belly-select' && (
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => setUserData({ ...userData, [currentQuestion.id]: 'obese' })}
                  className={`relative rounded-2xl border-2 transition-all duration-200 overflow-hidden aspect-[3/4] ${
                    userData[currentQuestion.id as keyof UserData] === 'obese'
                      ? 'border-[#A4D65E] shadow-lg shadow-green-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/01489e90-4c2f-4359-9443-3b549e268af6.png" 
                    alt="Tipo de barriga 1"
                    className="w-full h-full object-cover"
                  />
                  {userData[currentQuestion.id as keyof UserData] === 'obese' && (
                    <div className="absolute inset-0 bg-[#A4D65E]/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#A4D65E] flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setUserData({ ...userData, [currentQuestion.id]: 'overweight' })}
                  className={`relative rounded-2xl border-2 transition-all duration-200 overflow-hidden aspect-[3/4] ${
                    userData[currentQuestion.id as keyof UserData] === 'overweight'
                      ? 'border-[#A4D65E] shadow-lg shadow-green-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/20eeddcd-4bd0-4d04-a7e1-7802e5bea242.png" 
                    alt="Tipo de barriga 2"
                    className="w-full h-full object-cover"
                  />
                  {userData[currentQuestion.id as keyof UserData] === 'overweight' && (
                    <div className="absolute inset-0 bg-[#A4D65E]/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#A4D65E] flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setUserData({ ...userData, [currentQuestion.id]: 'normal' })}
                  className={`relative rounded-2xl border-2 transition-all duration-200 overflow-hidden aspect-[3/4] ${
                    userData[currentQuestion.id as keyof UserData] === 'normal'
                      ? 'border-[#A4D65E] shadow-lg shadow-green-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/61f333b1-d8e4-4a3c-b0d2-53d589b8598d.png" 
                    alt="Tipo de barriga 3"
                    className="w-full h-full object-cover"
                  />
                  {userData[currentQuestion.id as keyof UserData] === 'normal' && (
                    <div className="absolute inset-0 bg-[#A4D65E]/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#A4D65E] flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setUserData({ ...userData, [currentQuestion.id]: 'thin' })}
                  className={`relative rounded-2xl border-2 transition-all duration-200 overflow-hidden aspect-[3/4] ${
                    userData[currentQuestion.id as keyof UserData] === 'thin'
                      ? 'border-[#A4D65E] shadow-lg shadow-green-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop" 
                    alt="Pessoa muito magra"
                    className="w-full h-full object-cover"
                  />
                  {userData[currentQuestion.id as keyof UserData] === 'thin' && (
                    <div className="absolute inset-0 bg-[#A4D65E]/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#A4D65E] flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="bg-[#1a3a1f]/80 backdrop-blur-xl p-4 border-t border-white/10">
          <div className="max-w-2xl mx-auto flex gap-3">
            {onboardingStep > 0 && (
              <button
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            )}
            <button
              onClick={() => {
                if (onboardingStep < questions.length - 1) {
                  setOnboardingStep(onboardingStep + 1)
                } else {
                  completeOnboarding()
                }
              }}
              disabled={
                currentQuestion.type === 'multi-select' 
                  ? (currentQuestion.id === 'simpleGoals' 
                      ? !userData.simpleGoals || userData.simpleGoals.length === 0
                      : !userData.habits || userData.habits.length === 0)
                  : !userData[currentQuestion.id as keyof UserData]
              }
              className="flex-1 bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] text-white py-4 px-8 rounded-xl font-bold shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {onboardingStep < questions.length - 1 ? 'Avançar' : 'Ver meu resultado'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar tela de loading com cores verdes
  if (step === 'loading') {
    const loadingSteps = [
      { text: 'Analisando seu perfil...', icon: Brain },
      { text: 'Calculando seu IMC...', icon: Scale },
      { text: 'Criando plano personalizado...', icon: Target },
      { text: 'Selecionando receitas...', icon: ChefHat },
      { text: 'Definindo exercícios...', icon: Dumbbell },
      { text: 'Finalizando seu plano...', icon: Sparkles }
    ]

    const currentStepIndex = Math.min(Math.floor(loadingProgress / 17), loadingSteps.length - 1)
    const CurrentIcon = loadingSteps[currentStepIndex].icon

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Ícone animado */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#A4D65E] via-[#3A9D23] to-green-700 p-8 rounded-full shadow-2xl animate-bounce">
                <CurrentIcon className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">
              Preparando seu plano
            </h2>
            <p className="text-gray-400 text-lg">
              {loadingSteps[currentStepIndex].text}
            </p>
          </div>

          {/* Barra de progresso */}
          <div className="space-y-3">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] transition-all duration-300 ease-out shadow-lg shadow-green-500/50"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-[#A4D65E] font-bold text-2xl">
              {loadingProgress}%
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {loadingSteps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    index <= currentStepIndex
                      ? 'bg-green-500/10 border border-[#A4D65E]/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <StepIcon className={`w-5 h-5 ${index <= currentStepIndex ? 'text-[#A4D65E]' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${index <= currentStepIndex ? 'text-white' : 'text-gray-500'}`}>
                    {step.text}
                  </span>
                  {index < currentStepIndex && (
                    <Check className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                  {index === currentStepIndex && (
                    <Loader2 className="w-5 h-5 text-[#A4D65E] ml-auto animate-spin" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Renderizar tela de adaptação com cores verdes
  if (step === 'adapting' && plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5688a49a-6930-4b3e-a589-430d02aab575.png" 
              alt="Peso Certo Logo" 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-white font-bold text-lg">Peso Certo</span>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
          {/* Ícone principal */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-[#A4D65E] via-[#3A9D23] to-green-700 p-12 rounded-full shadow-2xl">
              <Target className="w-24 h-24 text-white" />
            </div>
          </div>

          {/* Texto principal */}
          <div className="text-center space-y-3 max-w-md">
            <h2 className="text-4xl font-bold text-white">
              Adaptando sua meta de atividade
            </h2>
            <p className="text-gray-400 text-lg">
              Estamos personalizando seu plano para alcançar seus objetivos
            </p>
          </div>

          {/* Barras de progresso */}
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Analisando perfil</span>
                <span className="text-[#A4D65E] font-bold">100%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] w-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Definindo metas</span>
                <span className="text-[#A4D65E] font-bold">{adaptingProgress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] transition-all duration-300"
                  style={{ width: `${adaptingProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Personalizando exercícios</span>
                <span className="text-gray-500 font-bold">{Math.max(0, adaptingProgress - 30)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, adaptingProgress - 30)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Depoimento */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              "O Peso Certo mudou minha vida! Perdi 15kg em 3 meses seguindo o plano personalizado. Recomendo muito!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A4D65E] to-[#3A9D23] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Maria Silva</div>
                <div className="text-gray-500 text-xs">Perdeu 15kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <a href="https://pesocerto.life" className="text-[#A4D65E] text-sm hover:underline">
            pesocerto.life
          </a>
        </div>
      </div>
    )
  }

  // Renderizar resultado do IMC com cores verdes
  if (step === 'bmi-result' && plan) {
    const bmiPercentage = Math.min(100, (plan.bmi / 40) * 100)
    const isHealthRisk = plan.bmi >= 30
    const weightToLose = (userData.currentWeight || 0) - (userData.targetWeight || 0)

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] p-4 overflow-y-auto py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5688a49a-6930-4b3e-a589-430d02aab575.png" 
                alt="Peso Certo Logo" 
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-white font-bold text-lg bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] bg-clip-text text-transparent">Peso Certo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Seu objetivo: perder {weightToLose.toFixed(1)}kg
            </h1>
            <p className="text-gray-400 text-lg">
              em aproximadamente {plan.estimatedWeeks} semanas
            </p>
          </div>

          {/* Gráfico de evolução de peso */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-[#A4D65E]" />
              Sua jornada de emagrecimento
            </h3>
            
            {/* Gráfico visual */}
            <div className="relative h-64 mb-6">
              {/* Linha do gráfico */}
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                {/* Grid de fundo */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                
                {/* Linha de progresso */}
                <polyline
                  points={`0,20 ${(plan.estimatedWeeks / 12) * 100},40 ${(plan.estimatedWeeks / 12) * 200},80 ${(plan.estimatedWeeks / 12) * 300},140 400,180`}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Gradiente */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A4D65E" />
                    <stop offset="100%" stopColor="#3A9D23" />
                  </linearGradient>
                </defs>
                
                {/* Pontos de marcação */}
                <circle cx="0" cy="20" r="5" fill="#A4D65E" />
                <circle cx={`${(plan.estimatedWeeks / 12) * 100}`} cy="40" r="5" fill="#A4D65E" />
                <circle cx={`${(plan.estimatedWeeks / 12) * 200}`} cy="80" r="5" fill="#A4D65E" />
                <circle cx={`${(plan.estimatedWeeks / 12) * 300}`} cy="140" r="5" fill="#3A9D23" />
                <circle cx="400" cy="180" r="6" fill="#3A9D23" />
              </svg>
              
              {/* Labels do gráfico */}
              <div className="absolute top-0 left-0 text-[#A4D65E] text-sm font-bold">
                {userData.currentWeight}kg
              </div>
              <div className="absolute bottom-0 right-0 text-[#3A9D23] text-sm font-bold">
                {userData.targetWeight}kg
              </div>
            </div>

            {/* Marcos temporais */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500">
              <div>Hoje</div>
              <div>Semana {Math.floor(plan.estimatedWeeks / 3)}</div>
              <div>Semana {Math.floor(plan.estimatedWeeks * 2 / 3)}</div>
              <div>Meta</div>
            </div>
          </div>

          {/* Benefícios esperados */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              O que você vai conquistar
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Mais energia no dia a dia</div>
                  <div className="text-gray-400 text-sm">Você vai se sentir mais disposto e produtivo</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#A4D65E]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#A4D65E]" />
                </div>
                <div>
                  <div className="text-white font-semibold">Melhora na saúde cardiovascular</div>
                  <div className="text-gray-400 text-sm">Redução de riscos de doenças cardíacas</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3A9D23]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#3A9D23]" />
                </div>
                <div>
                  <div className="text-white font-semibold">Autoestima elevada</div>
                  <div className="text-gray-400 text-sm">Mais confiança e bem-estar mental</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Sono de qualidade</div>
                  <div className="text-gray-400 text-sm">Descanso melhor e mais reparador</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de Análise */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-6 h-6 text-[#A4D65E]" />
                <span className="text-gray-400 text-sm font-medium">IMC</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{plan.bmi}</div>
              <div className="text-xs text-gray-500">{plan.bmiCategory}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Apple className="w-6 h-6 text-red-400" />
                <span className="text-gray-400 text-sm font-medium">Calorias</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{plan.dailyCalories}</div>
              <div className="text-xs text-gray-500">por dia</div>
            </div>
          </div>

          {/* Botão continuar */}
          <button
            onClick={() => setStep('subscription')}
            className="w-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] text-white py-6 px-8 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Obter meu plano
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    )
  }

  // Renderizar tela de assinatura com cores verdes
  if (step === 'subscription' && plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] flex flex-col">
        {/* Header com timer */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-5 h-5" />
            <span className="font-bold text-lg">60% de desconto reservado por:</span>
          </div>
          <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5688a49a-6930-4b3e-a589-430d02aab575.png" 
                  alt="Peso Certo Logo" 
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-white font-bold text-lg">Peso Certo</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Faça seu plano pessoal antes que acabe!
              </h1>
            </div>

            {/* Alerta de urgência */}
            <div className="bg-red-500 rounded-2xl p-4 text-center shadow-2xl">
              <div className="text-white font-bold text-xl mb-1 flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Essa promoção termina em {formatTime(timeLeft)}
              </div>
            </div>

            {/* Planos */}
            <div className="space-y-4">
              {/* Plano 1 semana */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-white font-bold text-3xl">1 SEMANA</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 line-through text-base">R$ 42,00</div>
                    <div className="text-white font-bold text-4xl">R$ 17,00</div>
                    <div className="text-gray-400 text-sm">R$ 2,42 por dia</div>
                  </div>
                </div>
                <button className="w-full bg-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 text-lg">
                  Escolher plano
                </button>
              </div>

              {/* Plano 4 semanas - MAIS POPULAR */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-[#A4D65E] relative shadow-2xl shadow-green-500/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <Crown className="w-4 h-4" />
                  MAIS POPULAR
                </div>
                <div className="flex items-center justify-between mb-5 mt-2">
                  <div>
                    <div className="text-white font-bold text-3xl">4 SEMANAS</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 line-through text-base">R$ 99,00</div>
                    <div className="text-white font-bold text-4xl">R$ 39,00</div>
                    <div className="text-gray-400 text-sm">R$ 1,39 por dia</div>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-gray-200 text-base">
                    <Check className="w-5 h-5 text-[#A4D65E] flex-shrink-0" />
                    Plano personalizado completo
                  </div>
                  <div className="flex items-center gap-3 text-gray-200 text-base">
                    <Check className="w-5 h-5 text-[#A4D65E] flex-shrink-0" />
                    Acompanhamento diário detalhado
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all text-lg">
                  Escolher plano
                </button>
              </div>

              {/* Plano 12 semanas */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-white font-bold text-3xl">12 SEMANAS</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 line-through text-base">R$ 169,00</div>
                    <div className="text-white font-bold text-4xl">R$ 69,00</div>
                    <div className="text-gray-400 text-sm">R$ 0,82 por dia</div>
                  </div>
                </div>
                <button className="w-full bg-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10 text-lg">
                  Escolher plano
                </button>
              </div>
            </div>

            {/* Botão teste grátis */}
            <button 
              onClick={() => setStep('dashboard')}
              className="w-full bg-gradient-to-r from-[#A4D65E] to-[#3A9D23] text-white py-6 px-8 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300"
            >
              Começar teste grátis de 7 dias
            </button>

            {/* Garantia */}
            <div className="text-center text-gray-400 text-base flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-2">
                🔒 Pagamento 100% seguro
              </span>
              <span className="flex items-center gap-2">
                ✅ Garantia de 7 dias
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center bg-[#1a3a1f]/80 backdrop-blur-xl border-t border-white/10">
          <a href="https://pesocerto.life" className="text-[#A4D65E] text-sm hover:underline">
            pesocerto.life
          </a>
        </div>
      </div>
    )
  }

  // Renderizar dashboard com cores verdes
  if (step === 'dashboard' && plan) {
    const weightLost = (userData.currentWeight || 0) - (todayProgress.weight || userData.currentWeight || 0)
    const progressPercentage = ((userData.currentWeight || 0) - (todayProgress.weight || userData.currentWeight || 0)) / ((userData.currentWeight || 0) - (userData.targetWeight || 0)) * 100

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a1f] via-[#0f2917] to-[#0a1a0e] pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#A4D65E] via-[#3A9D23] to-green-700 p-6 rounded-b-3xl shadow-2xl">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white">Olá! 👋</h1>
                <p className="text-green-100 mt-1 text-base">Você está indo muito bem!</p>
              </div>
              <button
                onClick={resetApp}
                className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all text-white font-medium backdrop-blur-sm"
              >
                Resetar
              </button>
            </div>

            {/* Progresso geral */}
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-white">Progresso geral</span>
                <span className="text-2xl font-bold text-white">{Math.max(0, Math.round(progressPercentage))}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500 shadow-lg"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm text-green-100 font-medium">
                <span>{userData.currentWeight}kg</span>
                <span>{userData.targetWeight}kg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-5 mt-5">
          {activeTab === 'home' && (
            <>
              {/* Cards de métricas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Scale className="w-6 h-6 text-[#A4D65E]" />
                    <span className="text-gray-400 text-sm font-medium">IMC</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{plan.bmi}</div>
                  <div className="text-xs text-gray-500 mt-1">{plan.bmiCategory}</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-6 h-6 text-green-400" />
                    <span className="text-gray-400 text-sm font-medium">Meta</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{plan.estimatedWeeks}</div>
                  <div className="text-xs text-gray-500 mt-1">semanas</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="w-6 h-6 text-red-400" />
                    <span className="text-gray-400 text-sm font-medium">Calorias</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{plan.dailyCalories}</div>
                  <div className="text-xs text-gray-500 mt-1">por dia</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-6 h-6 text-orange-400" />
                    <span className="text-gray-400 text-sm font-medium">Exercício</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{plan.exerciseMinutes}</div>
                  <div className="text-xs text-gray-500 mt-1">min/dia</div>
                </div>
              </div>

              {/* Macronutrientes */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-[#A4D65E]" />
                  Macronutrientes Diários
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-2xl">🥩</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{plan.proteinGrams}g</div>
                    <div className="text-xs text-gray-400 font-medium">Proteínas</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-2xl">🍞</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{plan.carbsGrams}g</div>
                    <div className="text-xs text-gray-400 font-medium">Carboidratos</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-2xl">🥑</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{plan.fatsGrams}g</div>
                    <div className="text-xs text-gray-400 font-medium">Gorduras</div>
                  </div>
                </div>
              </div>

              {/* Receitas Sugeridas */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-[#A4D65E]" />
                  Receitas Recomendadas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.recipes.slice(0, 4).map((recipe, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#A4D65E]/50 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{recipe.icon}</div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-sm">{recipe.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {recipe.time}
                            </span>
                            <span className="text-xs text-[#A4D65E] font-medium">{recipe.calories} cal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercícios Recomendados */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-[#A4D65E]" />
                  Exercícios Para Você
                </h2>
                <div className="space-y-3">
                  {plan.exercises.slice(0, 4).map((exercise, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#A4D65E]/50 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{exercise.icon}</div>
                          <div>
                            <div className="text-white font-semibold text-sm">{exercise.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{exercise.duration}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-400 font-bold text-lg">{exercise.calories}</div>
                          <div className="text-xs text-gray-500">calorias</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acompanhamento de hoje */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-7 h-7 text-[#A4D65E]" />
                  Hoje
                </h2>

                {/* Água */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-6 h-6 text-[#A4D65E]" />
                      <span className="font-semibold text-white text-base">Água</span>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{todayProgress.waterGlasses || 0}/{plan.waterGoal}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: plan.waterGoal }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateTodayProgress('waterGlasses', i + 1)}
                        className={`w-12 h-12 rounded-xl transition-all duration-200 ${
                          i < (todayProgress.waterGlasses || 0)
                            ? 'bg-[#A4D65E] shadow-lg shadow-green-500/50'
                            : 'bg-white/10 hover:bg-white/20 border border-white/10'
                        }`}
                      >
                        <Droplets className="w-6 h-6 mx-auto text-white" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exercício */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-6 h-6 text-green-400" />
                      <span className="font-semibold text-white text-base">Exercício</span>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{todayProgress.exerciseMinutes || 0}/{plan.exerciseMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={plan.exerciseMinutes * 2}
                    value={todayProgress.exerciseMinutes || 0}
                    onChange={(e) => updateTodayProgress('exerciseMinutes', Number(e.target.value))}
                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A4D65E]"
                  />
                </div>

                {/* Peso */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-6 h-6 text-[#3A9D23]" />
                    <span className="font-semibold text-white text-base">Peso hoje</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      step="0.1"
                      placeholder={`${userData.currentWeight}`}
                      value={todayProgress.weight || ''}
                      onChange={(e) => updateTodayProgress('weight', Number(e.target.value))}
                      className="flex-1 px-5 py-4 bg-white/10 text-white border border-white/10 rounded-xl focus:border-[#A4D65E] focus:outline-none backdrop-blur-sm text-lg font-semibold"
                    />
                    <span className="text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                {/* Calorias */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Apple className="w-6 h-6 text-red-400" />
                      <span className="font-semibold text-white text-base">Calorias</span>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{todayProgress.caloriesConsumed || 0}/{plan.dailyCalories}</span>
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    value={todayProgress.caloriesConsumed || ''}
                    onChange={(e) => updateTodayProgress('caloriesConsumed', Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white/10 text-white border border-white/10 rounded-xl focus:border-[#A4D65E] focus:outline-none backdrop-blur-sm text-lg font-semibold"
                  />
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        (todayProgress.caloriesConsumed || 0) > plan.dailyCalories ? 'bg-red-500' : 'bg-[#A4D65E]'
                      }`}
                      style={{ width: `${Math.min(100, ((todayProgress.caloriesConsumed || 0) / plan.dailyCalories) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Dicas do Coach */}
              <div className="bg-gradient-to-br from-[#A4D65E] via-[#3A9D23] to-green-700 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-7 h-7" />
                  Dicas do Coach
                </h2>
                <div className="space-y-3">
                  {plan.tips.slice(0, 3).map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl text-base">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-5">
              {/* Resumo Semanal */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingDown className="w-7 h-7 text-[#A4D65E]" />
                  Resumo Semanal
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#A4D65E]">{dailyProgress.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Dias registrados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {dailyProgress.reduce((acc, day) => acc + (day.waterGlasses || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Copos de água</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">
                      {dailyProgress.reduce((acc, day) => acc + (day.exerciseMinutes || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Min de exercício</div>
                  </div>
                </div>
              </div>

              {/* Histórico */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#A4D65E]" />
                  Histórico
                </h2>
                {dailyProgress.length > 0 ? (
                  <div className="space-y-3">
                    {dailyProgress.slice(-10).reverse().map((day, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-sm text-gray-400 font-medium">{new Date(day.date).toLocaleDateString('pt-BR')}</span>
                        <div className="flex gap-3 items-center">
                          {day.weight && <span className="text-base font-bold text-[#A4D65E]">{day.weight}kg</span>}
                          {day.waterGlasses > 0 && (
                            <span className="text-xs bg-[#A4D65E]/20 text-[#A4D65E] px-3 py-1 rounded-lg font-medium">
                              💧 {day.waterGlasses}
                            </span>
                          )}
                          {day.exerciseMinutes > 0 && (
                            <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-lg font-medium">
                              🏃 {day.exerciseMinutes}min
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Nenhum progresso registrado ainda</p>
                    <p className="text-sm mt-2">Comece hoje sua jornada!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="w-7 h-7 text-[#A4D65E]" />
                Configurações
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-sm mb-1 font-medium">Idade</div>
                  <div className="text-white font-semibold text-lg">{userData.age} anos</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-sm mb-1 font-medium">Altura</div>
                  <div className="text-white font-semibold text-lg">{userData.height} cm</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-sm mb-1 font-medium">Peso atual</div>
                  <div className="text-white font-semibold text-lg">{userData.currentWeight} kg</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-sm mb-1 font-medium">Meta de peso</div>
                  <div className="text-white font-semibold text-lg">{userData.targetWeight} kg</div>
                </div>
                <button
                  onClick={resetApp}
                  className="w-full bg-red-500/20 text-red-400 py-4 rounded-xl font-bold hover:bg-red-500/30 transition-all border border-red-500/30 text-base"
                >
                  Resetar aplicativo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navegação inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a3a1f]/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto flex justify-around items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                activeTab === 'home' ? 'text-[#A4D65E]' : 'text-gray-500'
              }`}
            >
              <Home className="w-7 h-7" />
              <span className="text-xs font-bold">Início</span>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                activeTab === 'progress' ? 'text-[#A4D65E]' : 'text-gray-500'
              }`}
            >
              <BarChart3 className="w-7 h-7" />
              <span className="text-xs font-bold">Progresso</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                activeTab === 'settings' ? 'text-[#A4D65E]' : 'text-gray-500'
              }`}
            >
              <Settings className="w-7 h-7" />
              <span className="text-xs font-bold">Config</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
