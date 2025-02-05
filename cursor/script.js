// 轮播图功能
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [
            { url: 'images/1.jpg', caption: '第一张照片说明' },
            { url: 'images/2.jpg', caption: '第二张照片说明' },
            { url: 'images/3.jpg', caption: '第三张照片说明' }
        ];
        
        this.initCarousel();
        this.startAutoPlay();
    }

    initCarousel() {
        const container = document.querySelector('.carousel-slides');
        this.slides.forEach(slide => {
            const div = document.createElement('div');
            div.className = 'slide';
            div.innerHTML = `
                <img src="${slide.url}" alt="${slide.caption}">
                <p class="caption">${slide.caption}</p>
            `;
            container.appendChild(div);
        });

        // 添加控制点
        const dots = document.querySelector('.carousel-dots');
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.addEventListener('click', () => this.goToSlide(index));
            dots.appendChild(dot);
        });
    }

    startAutoPlay() {
        setInterval(() => this.nextSlide(), 5000);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const container = document.querySelector('.carousel-slides');
        container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // 更新指示点状态
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// 聊天功能
class ChatWidget {
    constructor() {
        this.messages = [];
        this.initChat();
        this.DASHSCOPE_API_KEY = 'sk-ee5a952f6a3b4e278dc961b8a3af7efb';
    }

    initChat() {
        const sendBtn = document.querySelector('.send-btn');
        const input = document.querySelector('.chat-input input');
        const closeBtn = document.querySelector('.close-btn');

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        closeBtn.addEventListener('click', () => this.toggleChat());
    }

    async sendMessage() {
        const input = document.querySelector('.chat-input input');
        const message = input.value.trim();
        
        if (message) {
            // 显示用户消息
            this.addMessage('user', message);
            input.value = '';

            // 显示加载状态
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-message loading';
            loadingDiv.textContent = '正在思考...';
            document.querySelector('.chat-messages').appendChild(loadingDiv);

            try {
                const response = await this.getAIResponse(message);
                // 移除加载状态
                loadingDiv.remove();
                // 显示 AI 回复
                this.addMessage('ai', response);
            } catch (error) {
                // 移除加载状态
                loadingDiv.remove();
                // 显示错误消息
                this.addMessage('error', '抱歉，发生了一些错误，请稍后重试。');
                console.error('AI响应错误:', error);
            }
        }
    }

    async getAIResponse(userMessage) {
        const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.DASHSCOPE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "qwen-plus",
                messages: [
                    {
                        role: "system",
                        content: "你是一个友好的助手，负责回答关于汉武帝的问题。你应该表现得像一个历史专家。"
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(type, content) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // 添加时间戳
        const timestamp = new Date().toLocaleTimeString();
        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.textContent = timestamp;
        
        // 添加消息内容
        const contentP = document.createElement('p');
        contentP.textContent = content;
        
        messageDiv.appendChild(contentP);
        messageDiv.appendChild(timeSpan);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    toggleChat() {
        const chat = document.querySelector('.chat-widget');
        chat.classList.toggle('active');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
    new ChatWidget();
}); 