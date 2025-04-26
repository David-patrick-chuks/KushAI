export function Features() {
    const features = [
      {
        name: "Text Generation",
        description:
          "Generate human-like text for various applications, from creative writing to technical documentation.",
        icon: "🔥",
      },
      {
        name: "Image Generation",
        description: "Create stunning images from text descriptions with fine-grained control over the output.",
        icon: "🖼️",
      },
      {
        name: "Video Generation",
        description: "Transform text prompts into short videos with customizable duration and resolution.",
        icon: "🎥",
      },
      {
        name: "Structured Data",
        description: "Generate structured JSON data for seamless integration with your applications.",
        icon: "📊",
      },
      {
        name: "Audio Understanding",
        description: "Analyze and transcribe audio content with high accuracy.",
        icon: "🎙️",
      },
      {
        name: "Video Understanding",
        description: "Extract insights and information from video content.",
        icon: "🎞️",
      },
      {
        name: "Multimodal Inputs",
        description: "Combine text and images in your prompts for more contextual responses.",
        icon: "🧠",
      },
      {
        name: "Function Calling",
        description: "Use structured function calls for specific tasks and integrations.",
        icon: "🧩",
      },
      {
        name: "Image Understanding",
        description: "Analyze and extract information from images with detailed descriptions.",
        icon: "🖼️",
      },
    ]
  
    return (
      <div className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need for AI-powered applications
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Kushai provides a comprehensive suite of AI capabilities through a simple, unified interface.
            </p>
          </div>
  
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  