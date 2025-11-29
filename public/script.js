document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comment-form');
    const resultSection = document.getElementById('result-section');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const captionText = document.getElementById('caption-text');
    const commentsList = document.getElementById('comments-list');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset UI
        resultSection.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        commentsList.innerHTML = '';

        const formData = new FormData(form);
        const data = {
            url: formData.get('url'),
            tone: formData.get('tone'),
            length: formData.get('length')
        };

        try {
            const response = await fetch('http://localhost:4000/api/generate-comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || '오류가 발생했습니다.');
            }

            // Success
            captionText.textContent = result.caption || '(캡션 없음)';

            result.comments.forEach(comment => {
                const li = document.createElement('li');
                li.className = 'comment-item';

                const span = document.createElement('span');
                span.className = 'comment-text';
                span.textContent = comment;

                const btn = document.createElement('button');
                btn.className = 'copy-btn';
                btn.textContent = '복사';
                btn.onclick = () => {
                    navigator.clipboard.writeText(comment).then(() => {
                        const originalText = btn.textContent;
                        btn.textContent = '완료!';
                        setTimeout(() => {
                            btn.textContent = originalText;
                        }, 2000);
                    });
                };

                li.appendChild(span);
                li.appendChild(btn);
                commentsList.appendChild(li);
            });

            resultSection.classList.remove('hidden');

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    });
});
