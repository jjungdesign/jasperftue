// Marketing Campaign Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHeader();
    initializeChat();
    initializeCards();
    initializeActionBar();
    initializeCanvas();
    initializeCanvasControls();
    initializeResponsive();
    
    // Add smooth scrolling behavior
    initializeSmoothScrolling();
    
    // Add keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Initialize tour functionality
    initializeTour();
    
    // Initialize generation experience
    initializeGenerationExperience();

    // Element selectors
    const tourStartButton = document.getElementById('tourStartButton');
    const blogPostCard = document.getElementById('tour-blog-post-card');
    const canvasContainer = document.getElementById('canvasContainer');
    const canvasViewport = document.getElementById('canvasViewport');
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    const resetViewButton = document.getElementById('resetView');
    const zoomLevelIndicator = document.getElementById('zoomLevel');
    const websiteSection = document.querySelector('.website-blog')?.closest('.content-section');
    const websiteSectionTag = websiteSection?.querySelector('.section-tag');
    const websiteTooltip = document.getElementById('step-6-tooltip');
    const bulkEditToolbar = document.querySelector('.bulk-edit-toolbar');

    // State variables
    let currentZoom = 1;
    const zoomIncrement = 0.1;
    let isPanning = false;
    let startX, startY, scrollLeft, scrollTop;

    // Functions
    function updateZoomLevelIndicator() {
        if (zoomLevelIndicator) {
            zoomLevelIndicator.textContent = `${Math.round(currentZoom * 100)}%`;
        }
    }

    // Event Listeners
    if (tourStartButton && blogPostCard) {
        tourStartButton.addEventListener('click', () => {
            blogPostCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            blogPostCard.classList.add('highlight-tour-step');
            setTimeout(() => {
                blogPostCard.classList.remove('highlight-tour-step');
            }, 2000);
        });
    }

    // Initialize
    updateZoomLevelIndicator();

    // NOTE: Pan and zoom logic would go here
});

// Canvas variables
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 400;
let currentY = 200;
let scale = 1.2;

// Hotspot state tracking
let shouldShowCampaignEditAfterModalClose = false;

function initializeCanvas() {
    const canvasContainer = document.getElementById('canvasContainer');
    const canvasViewport = document.getElementById('canvasViewport');
    
    if (!canvasContainer || !canvasViewport) return;
    
    // Mouse events
    canvasContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events for mobile
    canvasContainer.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', endDrag);
    
    // Wheel zoom
    canvasContainer.addEventListener('wheel', handleWheel);
    
    // Prevent context menu on right click
    canvasContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Apply initial scale and position
    updateCanvasPosition();
    updateZoomLevel();
}

function startDrag(e) {
    // Don't drag if clicking on a card or interactive element
    if (e.target.closest('.asset-card, .icon-btn, .tag-label')) return;
    
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    
    document.getElementById('canvasContainer').classList.add('dragging');
    e.preventDefault();
}

function startDragTouch(e) {
    if (e.target.closest('.asset-card, .icon-btn, .tag-label')) return;
    
    const touch = e.touches[0];
    isDragging = true;
    startX = touch.clientX - currentX;
    startY = touch.clientY - currentY;
    
    document.getElementById('canvasContainer').classList.add('dragging');
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    
    updateCanvasPosition();
    e.preventDefault();
}

function dragTouch(e) {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    currentX = touch.clientX - startX;
    currentY = touch.clientY - startY;
    
    updateCanvasPosition();
    e.preventDefault();
}

function endDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    document.getElementById('canvasContainer').classList.remove('dragging');
}

function updateCanvasPosition() {
    const viewport = document.getElementById('canvasViewport');
    if (!viewport) return;
    
    viewport.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

function handleWheel(e) {
    e.preventDefault();
    
    // Check if this is a pinch-to-zoom gesture (ctrlKey is set for pinch gestures)
    if (e.ctrlKey) {
        // Handle zoom
        const delta = e.deltaY;
        const zoomFactor = 0.1;
        const minScale = 0.3;
        const maxScale = 2;
        
        if (delta > 0) {
            // Zoom out
            scale = Math.max(minScale, scale - zoomFactor);
        } else {
            // Zoom in
            scale = Math.min(maxScale, scale + zoomFactor);
        }
        
        updateCanvasPosition();
        updateZoomLevel();
    } else {
        // Handle panning with trackpad/touchpad
        const panSpeed = 1.5;
        
        // Use deltaX and deltaY for horizontal and vertical panning
        currentX -= e.deltaX * panSpeed;
        currentY -= e.deltaY * panSpeed;
        
        updateCanvasPosition();
    }
}

function initializeCanvasControls() {
    const resetBtn = document.getElementById('resetView');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCanvasView);
    }
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', zoomIn);
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', zoomOut);
    }
}

function resetCanvasView() {
    currentX = 400;
    currentY = 200;
    scale = 1.2;
    updateCanvasPosition();
    updateZoomLevel();
    showToast('View reset');
}

function zoomIn() {
    const maxScale = 2;
    scale = Math.min(maxScale, scale + 0.2);
    updateCanvasPosition();
    updateZoomLevel();
}

function zoomOut() {
    const minScale = 0.3;
    scale = Math.max(minScale, scale - 0.2);
    updateCanvasPosition();
    updateZoomLevel();
}

function updateZoomLevel() {
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(scale * 100) + '%';
    }
}

function initializeHeader() {
    const backBtn = document.querySelector('.header-btn');
    const titleBtn = document.querySelector('.header-title-btn');
    const shareBtn = document.querySelector('.share-btn');
    const avatar = document.querySelector('.avatar');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('Back button clicked');
            showToast('Navigation back');
        });
    }
    
    if (titleBtn) {
        titleBtn.addEventListener('click', function() {
            console.log('Title button clicked');
            showProjectSettings();
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            console.log('Share button clicked');
            shareProject();
        });
    }
    
    if (avatar) {
        avatar.addEventListener('click', function() {
            console.log('Avatar clicked');
            showToast('User profile');
        });
    }
}

function initializeChat() {
    const chatButtons = document.querySelectorAll('.chat-icon-btn');
    const inputField = document.querySelector('.input-field');
    const inputButtons = document.querySelectorAll('.input-btn');
    const sendBtn = document.querySelector('.send-btn');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    const agentsBtn = document.querySelector('.agents-btn');
    
    // Chat header buttons
    chatButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const svg = btn.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                const pathData = path?.getAttribute('d') || '';
                
                if (pathData.includes('M2 4h12M2 8h12M2 12h12')) {
                    console.log('Chat menu clicked');
                    showToast('Chat menu');
                } else if (pathData.includes('M3 3h10v10H3z')) {
                    console.log('Chat expand clicked');
                    toggleChatExpanded();
                } else if (pathData.includes('M4 4l8 8M12 4l-8 8')) {
                    console.log('Chat fullscreen clicked');
                    showToast('Fullscreen mode');
                } else if (pathData.includes('M6 6l4 4M10 6l-4 4')) {
                    console.log('Close chat clicked');
                    minimizeChat();
                }
            }
        });
    });
    
    // Suggestion buttons
    suggestionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const suggestion = this.textContent;
            console.log('Suggestion clicked:', suggestion);
            
            // Add the suggestion to the input field
            if (inputField) {
                inputField.value = suggestion;
                inputField.focus();
            }
            
            showToast('Suggestion added to input');
        });
    });
    
    // Agents button
    if (agentsBtn) {
        agentsBtn.addEventListener('click', function() {
            console.log('Agents button clicked');
            showAgentsMenu(this);
        });
    }
    
    // Input field interaction
    if (inputField) {
        inputField.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#0070EE';
        });
        
        inputField.addEventListener('blur', function() {
            this.parentElement.style.borderColor = '#E5E7EB';
        });
        
        // Enhanced Enter key handling for campaign brief pill submission
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent default to avoid newline
                handleChatSubmission();
            }
        });
        
        // Also handle keydown for more reliable Enter key detection
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent default to avoid newline
                handleChatSubmission();
            }
        });
    }
    
    // Input buttons (attachment, etc.)
    inputButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const svg = btn.querySelector('svg');
            const path = svg?.querySelector('path');
            const pathData = path?.getAttribute('d') || '';
            
            if (pathData.includes('M8 3v10M3 8h10')) {
                console.log('Add attachment clicked');
                showToast('Add attachment');
            } else if (pathData.includes('M8 2v12M2 8h12')) {
                console.log('Add content clicked');
                showToast('Add content');
            }
        });
    });
    
    // Send button (separate handling)
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            console.log('Send button clicked');
            handleChatSubmission();
        });
    }
}

function initializeCards() {
    const cards = document.querySelectorAll('.asset-card');
    const iconButtons = document.querySelectorAll('.icon-btn');
    
    // Card hover effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!isDragging) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!isDragging) {
                this.style.transform = 'translateY(0)';
            }
        });
        
        // Card click to expand
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.icon-btn') && !isDragging) {
                // Don't expand campaign brief - it has its own click handler
                if (!this.classList.contains('campaign-brief')) {
                    expandCard(this);
                }
            }
        });
    });
    
    // Icon button interactions
    iconButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = btn.closest('.asset-card');
            const cardTitle = card?.querySelector('.card-title')?.textContent || 'Asset';
            
            if (btn.textContent === '⋮') {
                showCardMenu(btn, cardTitle);
            } else {
                const svg = btn.querySelector('svg');
                if (svg?.querySelector('path[d*="M7.41667 5.08333L11.5 1"]')) {
                    expandCard(card);
                } else {
                    console.log(`Icon button clicked for ${cardTitle}`);
                    showToast(`${cardTitle} action`);
                }
            }
        });
    });
}

function initializeActionBar() {
    const jasperBtn = document.querySelector('.jasper-btn');
    const searchBtn = document.querySelector('.search-btn');
    const plusBtn = document.querySelector('.plus-btn');
    
    if (jasperBtn) {
        jasperBtn.addEventListener('click', function() {
            console.log('Jasper AI assistant clicked');
            openJasperChat();
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            console.log('Search clicked');
            openSearch();
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            console.log('Add new asset clicked');
            showCreateMenu();
        });
    }
}

function initializeResponsive() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            adjustLayoutForScreen();
        }, 150);
    });
    
    // Initial adjustment
    adjustLayoutForScreen();
}

function initializeSmoothScrolling() {
    const scrollableElements = document.querySelectorAll('.chat-content');
    
    scrollableElements.forEach(element => {
        element.style.scrollBehavior = 'smooth';
    });
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape key to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
        
        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        
        // Cmd/Ctrl + / for help
        if ((e.metaKey || e.ctrlKey) && e.key === '/') {
            e.preventDefault();
            showToast('Keyboard shortcuts: Esc (close), Cmd+K (search), Cmd+/ (help)');
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const sections = document.querySelectorAll('.content-section');
            const currentSection = document.querySelector('.content-section.active');
            let currentIndex = Array.from(sections).indexOf(currentSection);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                navigateToSection(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
                navigateToSection(currentIndex + 1);
            }
        }
    });
}

function initializeTour() {
    const tourStartButton = document.getElementById('tourStartButton');
    
    // Check if the listener has already been added to prevent duplicates
    if (tourStartButton && !tourStartButton.dataset.listenerAttached) {
        tourStartButton.addEventListener('click', startTour);
        tourStartButton.dataset.listenerAttached = 'true';
    }
}

// Navigation Functions
function navigateToSection(sectionIndex) {
    const sections = document.querySelectorAll('.content-section');
    if (sections[sectionIndex]) {
        const sectionRect = sections[sectionIndex].getBoundingClientRect();
        const containerRect = document.getElementById('canvasContainer').getBoundingClientRect();
        
        // Calculate offset to center the section
        const offsetX = -(sectionRect.left - containerRect.left - (containerRect.width / 2) + (sectionRect.width / 2));
        const offsetY = -(sectionRect.top - containerRect.top - (containerRect.height / 2) + (sectionRect.height / 2));
        
        // Animate to section
        animateCanvasTo(offsetX, offsetY);
    }
}

function animateCanvasTo(targetX, targetY, duration = 500, callback) {
    const startX = currentX;
    const startY = currentY;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        currentX = startX + (targetX - startX) * easeProgress;
        currentY = startY + (targetY - startY) * easeProgress;
        
        updateCanvasPosition();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(animate);
}

// Utility Functions

function shareProject() {
    if (navigator.share) {
        navigator.share({
            title: 'Marketing Campaign - Snoopy x UNIQLO',
            text: 'Check out this marketing campaign for the Snoopy x UNIQLO collaboration!',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!');
        });
    }
}

function toggleChatExpanded() {
    const chatSidebar = document.querySelector('.chat-sidebar');
    chatSidebar.classList.toggle('expanded');
    
    if (chatSidebar.classList.contains('expanded')) {
        chatSidebar.style.width = '400px';
        showToast('Chat expanded');
    } else {
        chatSidebar.style.width = '450px';
        showToast('Chat collapsed');
    }
}

function minimizeChat() {
    const chatSidebar = document.querySelector('.chat-sidebar');
    chatSidebar.style.width = '60px';
    chatSidebar.classList.add('minimized');
    showToast('Chat minimized');
}

function sendMessage() {
    const input = document.querySelector('.input-field');
    const campaignBriefPill = document.querySelector('.context-pill-demo');
    
    // Check if input has content or if placeholder content should be used
    let message = '';
    if (input && input.value.trim()) {
        message = input.value.trim();
    } else if (campaignBriefPill && input && input.placeholder) {
        // Use placeholder text if no input and campaign brief is selected
        message = input.placeholder;
    }
    
    if (message) {
        console.log('Sending message:', message);
        
        // Add message to chat
        addMessageToChat('', message, false);
        
        // Clear input
        if (input) {
            input.value = '';
        }
        
        // Check if campaign brief pill is present - generate Instagram posts
        if (campaignBriefPill) {
            // Remove the campaign brief pill after sending
            removeCampaignBriefPill();
            
            // Start Instagram post generation
            setTimeout(() => {
                addJasperLoadingMessage('Creating Instagram posts...');
                generateInstagramPosts();
            }, 500);
        } else {
            // Regular Jasper response for other messages
            setTimeout(() => {
                const responses = [
                    "I'll help you create that content right away!",
                    "Great idea! Let me work on that for you.",
                    "I can definitely help with that. Here's what I suggest...",
                    "Perfect! I'll generate that content based on your requirements."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessageToChat('Jasper', randomResponse, true);
            }, 1000);
        }
    }
}

function handleChatSubmission() {
    console.log('handleChatSubmission called');
    
    const input = document.querySelector('.input-field');
    const campaignBriefPill = document.querySelector('.context-pill-demo');
    const sendBtn = document.querySelector('.send-btn');
    
    // Prevent multiple submissions
    if (sendBtn && sendBtn.disabled) {
        return;
    }
    
    // Check if we have content to send
    let canSubmit = false;
    let message = '';
    
    if (input && input.value.trim()) {
        message = input.value.trim();
        canSubmit = true;
    } else if (campaignBriefPill && input && input.placeholder) {
        // Allow submission using placeholder text when campaign brief is selected
        message = input.placeholder;
        canSubmit = true;
    }
    
    if (canSubmit && message) {
        console.log('Submitting message:', message);
        
        // Temporarily disable the send button to prevent double submissions
        if (sendBtn) {
            sendBtn.disabled = true;
        }
        
        // Call the existing sendMessage function
        sendMessage();
        
        // Re-enable the send button after a short delay
        setTimeout(() => {
            if (sendBtn) {
                sendBtn.disabled = false;
            }
        }, 500);
    } else {
        console.log('No content to submit');
    }
}

function addMessageToChat(author, message, isJasper, isSubtle = false) {
    // Updated: Added subtle message styling for tour notifications
    const chatContent = document.querySelector('.chat-content');
    const greeting = document.querySelector('.jasper-greeting');
    
    // Hide greeting if this is the first message
    if (greeting && greeting.style.display !== 'none') {
        greeting.style.display = 'none';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    // Different styling for subtle messages
    if (isSubtle) {
        console.log('Creating subtle message with styling:', message);
        messageDiv.style.cssText = `
            margin-bottom: 8px;
            padding: 4px 6px;
            border-radius: 8px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.4s ease;
            background: #EDF5FE;
            margin-left: auto;
            margin-right: 20px;
            text-align: center;
            display: inline-block;
            width: fit-content;
            max-width: 150px;
        `;
        
        messageDiv.innerHTML = `
            <div style="font-size: 12px; color: #000; line-height: 1.3;">${message}</div>
        `;
        console.log('Subtle message element created:', messageDiv);
    } else {
        messageDiv.style.cssText = `
            margin-bottom: 16px;
            padding: 12px;
            border-radius: 8px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
            ${isJasper ? 'background: #F8F9FA; margin-right: 20px;' : 'background: #E5E7EB; color: #374151; margin-left: 20px; align-self: flex-end; border-radius: 16px 16px 4px 16px; padding: 12px 16px; max-width: 80%; font-size: 14px; line-height: 1.4;'}
        `;
        
        messageDiv.innerHTML = `
            ${author ? `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                ${isJasper ? '<div class="jasper-avatar"></div>' : '<div style="width: 20px; height: 20px; background: #9CA3AF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white;">U</div>'}
                <span style="font-size: 13px; font-weight: 600; ${isJasper ? 'color: #262627;' : 'color: #374151;'}">${author}</span>
            </div>` : ''}
            <div style="font-size: 14px; line-height: 1.5; ${isJasper ? 'color: #6B7280;' : 'color: #374151;'}">${message}</div>
        `;
    }
    
    // For subtle messages, wrap in a right-aligned container
    if (isSubtle) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
        `;
        wrapper.appendChild(messageDiv);
        chatContent.appendChild(wrapper);
    } else {
        chatContent.appendChild(messageDiv);
    }
    
    // Animate in with smooth transition
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Scroll to bottom with smooth animation
    setTimeout(() => {
        chatContent.scrollTop = chatContent.scrollHeight;
    }, 200);
}

function expandCard(card) {
    if (!card) return;
    
    const cardTitle = card.querySelector('.card-title')?.textContent || 'Asset';
    console.log('Expanding card:', cardTitle);
    
    // Add expanded class for animations
    card.classList.add('expanded');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
    `;
    
    // Clone card for expanded view
    const expandedCard = card.cloneNode(true);
    expandedCard.style.cssText = `
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        margin: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: scale(0.9);
        transition: transform 0.2s ease;
    `;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    expandedCard.style.position = 'relative';
    expandedCard.appendChild(closeBtn);
    overlay.appendChild(expandedCard);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        expandedCard.style.transform = 'scale(1)';
    }, 10);
    
    // Close handlers
    const closeExpanded = () => {
        overlay.remove();
        card.classList.remove('expanded');
    };
    
    closeBtn.addEventListener('click', closeExpanded);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeExpanded();
    });
}

function showCardMenu(button, cardTitle) {
    const menu = document.createElement('div');
    menu.className = 'card-menu';
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        min-width: 150px;
        overflow: hidden;
    `;
    
    const menuItems = [
        { label: 'Edit', action: () => console.log(`Edit ${cardTitle}`) },
        { label: 'Duplicate', action: () => console.log(`Duplicate ${cardTitle}`) },
        { label: 'Download', action: () => console.log(`Download ${cardTitle}`) },
        { label: 'Delete', action: () => console.log(`Delete ${cardTitle}`) }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('button');
        menuItem.textContent = item.label;
        menuItem.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: none;
            background: none;
            text-align: left;
            font-size: 13px;
            cursor: pointer;
            border-bottom: 1px solid #F3F4F6;
        `;
        
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = '#F9FAFB';
        });
        
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'none';
        });
        
        menuItem.addEventListener('click', () => {
            item.action();
            menu.remove();
            showToast(`${item.label} ${cardTitle}`);
        });
        
        menu.appendChild(menuItem);
    });
    
    // Position menu
    button.style.position = 'relative';
    button.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
}

function openJasperChat() {
    showToast('Opening Jasper AI Assistant');
    const chatSidebar = document.querySelector('.chat-sidebar');
    chatSidebar.scrollIntoView({ behavior: 'smooth' });
}

function openSearch() {
    const searchOverlay = document.createElement('div');
    searchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(4px);
        z-index: 2000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 100px;
    `;
    
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        background: white;
        border: 2px solid #0070EE;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    `;
    
    searchContainer.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: #262627;">Search Campaign Assets</h3>
        <input type="text" placeholder="Search for assets, content, or campaigns..." 
               style="width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; outline: none;">
        <div style="margin-top: 16px; font-size: 12px; color: #6B7280;">
            Press <kbd>Escape</kbd> to close • <kbd>R</kbd> to reset view • <kbd>+/-</kbd> to zoom
        </div>
    `;
    
    searchOverlay.appendChild(searchContainer);
    document.body.appendChild(searchOverlay);
    
    const input = searchContainer.querySelector('input');
    input.focus();
    
    // Close on escape or click outside
    const closeSearch = () => searchOverlay.remove();
    
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            closeSearch();
            document.removeEventListener('keydown', handleEscape);
        }
    });
    
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
    });
}

function showCreateMenu() {
    const createTypes = [
        { label: 'Campaign Brief', icon: '📄', section: 0 },
        { label: 'Social Media Post', icon: '📱', section: 1 },
        { label: 'Landing Page', icon: '🌐', section: 2 },
        { label: 'Product Shot', icon: '📸', section: 2 },
        { label: 'Blog Post', icon: '✍️', section: 2 },
        { label: 'Video Script', icon: '🎬', section: 1 }
    ];
    
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border: 1px solid #E5E7EB;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        z-index: 1500;
        padding: 12px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        width: 300px;
    `;
    
    createTypes.forEach(type => {
        const item = document.createElement('button');
        item.style.cssText = `
            padding: 12px;
            border: none;
            background: none;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            transition: background-color 0.2s;
        `;
        
        item.innerHTML = `
            <span style="font-size: 24px;">${type.icon}</span>
            <span>${type.label}</span>
        `;
        
        item.addEventListener('mouseenter', () => {
            item.style.background = '#F9FAFB';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = 'none';
        });
        
        item.addEventListener('click', () => {
            console.log(`Create new ${type.label}`);
            showToast(`Creating ${type.label}...`);
            menu.remove();
            
            // Navigate to the appropriate section
            if (type.section !== undefined) {
                setTimeout(() => navigateToSection(type.section), 500);
            }
        });
        
        menu.appendChild(item);
    });
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('.plus-btn')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
}

function adjustLayoutForScreen() {
    const width = window.innerWidth;
    const chatSidebar = document.querySelector('.chat-sidebar');
    const canvasContainer = document.getElementById('canvasContainer');
    
    if (width <= 640) {
        chatSidebar.style.width = '100%';
        chatSidebar.style.height = '200px';
        canvasContainer.style.left = '0';
        canvasContainer.style.top = '248px';
        canvasContainer.style.width = '100vw';
        canvasContainer.style.height = 'calc(100vh - 248px)';
    } else if (width <= 768) {
        chatSidebar.style.width = '280px';
        chatSidebar.style.height = 'calc(100vh - 48px)';
        canvasContainer.style.left = '280px';
        canvasContainer.style.top = '0';
        canvasContainer.style.width = 'calc(100vw - 280px)';
        canvasContainer.style.height = '100%';
    } else {
        if (!chatSidebar.classList.contains('minimized')) {
            chatSidebar.style.width = '450px';
        }
        chatSidebar.style.height = 'calc(100vh - 48px)';
        canvasContainer.style.left = chatSidebar.classList.contains('minimized') ? '60px' : '490px';
        canvasContainer.style.top = '0';
        canvasContainer.style.width = chatSidebar.classList.contains('minimized') ? 'calc(100vw - 60px)' : 'calc(100vw - 510px)';
        canvasContainer.style.height = '100%';
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: #262627;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 3000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function closeAllModals() {
    document.querySelectorAll('.card-overlay, .card-menu').forEach(el => el.remove());
}

function showAgentsMenu(button) {
    const menu = document.createElement('div');
    menu.className = 'agents-menu';
    menu.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 0;
        background: white;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        margin-bottom: 8px;
    `;
    
    const agents = [
        { name: 'Marketing Agent', icon: '📢', description: 'Campaign creation & optimization' },
        { name: 'Content Agent', icon: '✍️', description: 'Writing & content generation' },
        { name: 'Design Agent', icon: '🎨', description: 'Visual design & branding' },
        { name: 'Analytics Agent', icon: '📊', description: 'Data analysis & insights' }
    ];
    
    agents.forEach(agent => {
        const agentItem = document.createElement('button');
        agentItem.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            border: none;
            background: none;
            text-align: left;
            cursor: pointer;
            border-bottom: 1px solid #F3F4F6;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        agentItem.innerHTML = `
            <span style="font-size: 20px;">${agent.icon}</span>
            <div>
                <div style="font-size: 13px; font-weight: 600; color: #262627;">${agent.name}</div>
                <div style="font-size: 12px; color: #6B7280;">${agent.description}</div>
            </div>
        `;
        
        agentItem.addEventListener('mouseenter', () => {
            agentItem.style.background = '#F9FAFB';
        });
        
        agentItem.addEventListener('mouseleave', () => {
            agentItem.style.background = 'none';
        });
        
        agentItem.addEventListener('click', () => {
            console.log(`Selected agent: ${agent.name}`);
            showToast(`Connected to ${agent.name}`);
            menu.remove();
        });
        
        menu.appendChild(agentItem);
    });
    
    // Position menu
    button.style.position = 'relative';
    button.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
}

function showProjectSettings() {
    // Store the flag state before hiding tooltips
    const wasFromSettingsHotspot = shouldShowCampaignEditAfterModalClose;
    
    // Clear flag temporarily to prevent immediate 2nd hotspot in hideSettingsHotspot()
    shouldShowCampaignEditAfterModalClose = false;
    
    // Hide tooltips if they're visible
    hideSettingsHotspot();
    hideCampaignEditHotspot();
    hideAppsAutomationHotspot();
    hideShareButtonHotspot();
    
    // Restore flag for modal close if user came from settings hotspot
    if (wasFromSettingsHotspot) {
        shouldShowCampaignEditAfterModalClose = true;
    }
    
    // Check if modal is already open - if so, keep it open
    if (document.querySelector('.project-settings-modal')) {
        return;
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'project-settings-modal';
    modal.style.cssText = `
        position: fixed;
        top: 48px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: #FFFFFF;
        border-radius: 12px;
        width: 400px;
        max-width: 90vw;
        max-height: calc(100vh - 68px);
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid #E5E7EB;
        z-index: 2000;
        opacity: 0;
        transition: all 0.2s ease;
    `;
    
    // Modal content
    modal.innerHTML = `
        <div style="padding: 12px;">
            <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #1F2937;">Project settings</h2>
            
            <div style="
                border: 1px solid #D1D5DB;
                border-radius: 8px;
                background: white;
                margin-bottom: 10px;
                overflow: hidden;
            ">
                <div style="
                    padding: 8px 12px;
                    border-bottom: 1px solid #E5E7EB;
                ">
                    <div style="
                        font-size: 11px;
                        font-weight: 500;
                        color: #6B7280;
                        margin-bottom: 2px;
                    ">Title</div>
                    <input type="text" value="Summer of Sniffs Campaign" placeholder="Name your project" style="
                        width: 100%;
                        border: none;
                        outline: none;
                        font-size: 13px;
                        color: #1F2937;
                        background: transparent;
                        padding: 0;
                        height: 18px;
                        line-height: 18px;
                    ">
                </div>
                <div style="
                    padding: 8px 12px;
                ">
                    <div style="
                        font-size: 11px;
                        font-weight: 500;
                        color: #6B7280;
                        margin-bottom: 2px;
                    ">Goal</div>
                    <textarea placeholder="Describe your project, goals, etc..." style="
                        width: 100%;
                        border: none;
                        outline: none;
                        font-size: 13px;
                        color: #1F2937;
                        background: transparent;
                        resize: none;
                        min-height: 32px;
                        max-height: 32px;
                        font-family: inherit;
                        padding: 0;
                        line-height: 16px;
                        overflow: hidden;
                    ">A summer-themed marketing push promoting Whisker & Tails' new limited-edition seasonal flavors like "Grilled Salmon Picnic" (for cats) and "BBQ Chicken Feast" (for dogs). The campaign encourages pet parents to create joyful summer memories with their pets.</textarea>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: #374151;">
                    Set the voice, audience, and language for your project
                    <svg viewBox="0 0 16 16" width="14" height="14" style="margin-left: 4px; vertical-align: middle; color: #9CA3AF;">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        <path d="M8 12V8M8 4h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </label>
                
                <div style="margin-bottom: 6px;">
                    <select style="
                        width: 100%;
                        padding: 6px 10px;
                        border: 1px solid #D1D5DB;
                        border-radius: 6px;
                        font-size: 13px;
                        outline: none;
                        background: white;
                        cursor: pointer;
                        height: 32px;
                    ">
                        <option>Pet Parents</option>
                        <option>Blog Posts</option>
                        <option>Social Media</option>
                        <option>Email Marketing</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 6px;">
                    <select style="
                        width: 100%;
                        padding: 6px 10px;
                        border: 1px solid #D1D5DB;
                        border-radius: 6px;
                        font-size: 13px;
                        outline: none;
                        background: white;
                        cursor: pointer;
                        height: 32px;
                    ">
                        <option>Adventurous Millennial Pet Parents</option>
                        <option>Marketing Professionals</option>
                        <option>Small Business Owners</option>
                        <option>Enterprise Teams</option>
                    </select>
                </div>
                
                <div>
                    <select style="
                        width: 100%;
                        padding: 6px 10px;
                        border: 1px solid #D1D5DB;
                        border-radius: 6px;
                        font-size: 13px;
                        outline: none;
                        background: white;
                        cursor: pointer;
                        height: 32px;
                    ">
                        <option>English (American)</option>
                        <option>English (British)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                    </select>
                </div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: #374151;">Upload context to help Jasper provide better responses</label>
                <div style="
                    border: 1px solid #E5E7EB;
                    border-radius: 6px;
                    padding: 12px;
                    background: #FFFFFF;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 8px;
                        background: #F9FAFB;
                        border-radius: 4px;
                        border: 1px solid #E5E7EB;
                        margin-bottom: 8px;
                    ">
                        <div style="
                            width: 32px;
                            height: 32px;
                            background: #EF4444;
                            border-radius: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: WHITE;
                            font-size: 12px;
                            font-weight: 600;
                        ">PDF</div>
                        <div style="flex: 1;">
                            <div style="
                                font-size: 13px;
                                font-weight: 500;
                                color: #1F2937;
                                margin-bottom: 2px;
                            ">consumer_insights_report.pdf</div>
                            <div style="
                                font-size: 11px;
                                color: #6B7280;
                            ">2.4 MB • PDF Document</div>
                        </div>
                        <button style="
                            background: none;
                            border: none;
                            color: #9CA3AF;
                            cursor: pointer;
                            padding: 4px;
                            border-radius: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        " onmouseover="this.style.background='#F3F4F6'; this.style.color='#6B7280'" onmouseout="this.style.background='none'; this.style.color='#9CA3AF'">
                            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                <path d="M12.7.3a1 1 0 0 1 0 1.4L9.4 5l3.3 3.3a1 1 0 0 1-1.4 1.4L8 6.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L6.6 5 3.3 1.7a1 1 0 0 1 1.4-1.4L8 3.6l3.3-3.3a1 1 0 0 1 1.4 0z"/>
                            </svg>
                        </button>
                    </div>
                    <button style="
                        background: none;
                        border: 2px dashed #D1D5DB;
                        color: #3B82F6;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        margin: 0 auto;
                        padding: 8px 16px;
                        border-radius: 6px;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='#3B82F6'; this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#D1D5DB'; this.style.background='transparent'">
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                            <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        </svg>
                        Add Context
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeProjectSettings();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Close when clicking outside the modal
    const handleClickOutside = (e) => {
        if (!modal.contains(e.target)) {
            closeProjectSettings();
            document.removeEventListener('click', handleClickOutside);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 10);
}

function closeProjectSettings() {
    const modal = document.querySelector('.project-settings-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            modal.remove();
            
            // Check if we should show campaign edit hotspot after modal closes
            if (shouldShowCampaignEditAfterModalClose) {
                shouldShowCampaignEditAfterModalClose = false; // Reset flag
                setTimeout(() => {
                    showCampaignEditHotspot();
                }, 300);
            }
        }, 200);
    }
}

function saveProjectSettings() {
    showToast('Project settings saved successfully!');
    closeProjectSettings();
}



// Initialize tour button on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add tour button click handler
    const tourButton = document.getElementById('tourStartButton');
    if (tourButton) {
        tourButton.addEventListener('click', startTour);
    }
});

function startTour() {
    console.log('startTour function called');
    
    // First, open the project settings modal
    showProjectSettings();
    
    // Add a subtle chat message to indicate tour started at the same time
    addMessageToChat('', 'Started the tour', false, true);
    
    // Wait a moment for the modal to appear, then show the tooltip
    setTimeout(() => {
        showTourTooltip();
    }, 300);
}

function showTourTooltip() {
    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // Find the modal
    const modal = document.querySelector('.project-settings-modal');
    if (!modal) return;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.innerHTML = `
        <div class="tour-tooltip-content">
            <button class="tour-tooltip-close" onclick="closeTour()">&times;</button>
            <h3 class="tour-tooltip-title">Step 1: Setup project settings</h3>
            <p class="tour-tooltip-body">Define your project's foundation here - brand voice, audience, goals, and all reference materials will automatically apply to all content created in this project.</p>
            <div class="tour-tooltip-actions">
                <button class="tour-next-btn" onclick="closeTourTooltip()">Next</button>
            </div>
        </div>
        <div class="tour-tooltip-arrow"></div>
    `;
    
    // Add to body
    document.body.appendChild(tooltip);
    
    // Position the tooltip to the right of the modal
    positionTourTooltip(tooltip, modal);
}

function positionTourTooltip(tooltip, modal) {
    const modalRect = modal.getBoundingClientRect();
    const tooltipWidth = 320; // Updated width
    const tooltipHeight = 180; // Updated height
    
    // Position to the right of the modal with some spacing
    const left = modalRect.right + 20;
    const top = modalRect.top + (modalRect.height / 2) - (tooltipHeight / 2);
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

function closeTourTooltip() {
    console.log('Closing tour tooltip and starting step 2');
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
    
    // Close the modal
    closeProjectSettings();
    
    // Start step 2 after modal closes
    setTimeout(() => {
        startTourStep2();
    }, 300);
}

function startTourStep2() {
    console.log('Starting tour step 2');
    // Find and highlight the Campaign Brief card
    const campaignBriefCard = document.querySelector('.campaign-brief');
    console.log('Campaign brief card found:', campaignBriefCard);
    if (!campaignBriefCard) {
        console.error('Campaign brief card not found!');
        return;
    }
    
    // Add highlight class
    campaignBriefCard.classList.add('tour-highlight');
    console.log('Added tour-highlight class');
    
    // Pan canvas to align the Campaign Brief card at the top
    panToElement(campaignBriefCard, () => {
        console.log('Pan animation complete, showing tooltip');
        // Show the second tooltip after panning is complete
        showTourTooltipStep2(campaignBriefCard);
    }, true);
}

function showTourTooltipStep2(targetElement) {
    console.log('showTourTooltipStep2 called with element:', targetElement);
    
    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) {
        console.log('Removing existing tooltip');
        existingTooltip.remove();
    }
    
    // Create tooltip for step 2
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip tour-tooltip-attached';
    tooltip.innerHTML = `
        <div class="tour-tooltip-content">
            <button class="tour-tooltip-close" onclick="closeTour()">&times;</button>
            <h3 class="tour-tooltip-title">Step 2: Start with an App</h3>
            <p class="tour-tooltip-body">Open a Jasper App, like Campaign Brief, and fill in all input fields. This will build your first asset inside your project and kickstart your campaign.</p>
            <div class="tour-tooltip-actions">
                <button class="tour-back-btn" onclick="goBackToTourStep1()">Back</button>
                <button class="tour-next-btn" onclick="restartModalAnimation()">Show me how</button>
            </div>
        </div>
        <div class="tour-tooltip-arrow"></div>
    `;
    
    console.log('Created tooltip element:', tooltip);
    
    // Add to body
    document.body.appendChild(tooltip);
    console.log('Tooltip added to body');
    
    // Store reference to target element for repositioning
    tooltip.targetElement = targetElement;
    
    // Position the tooltip to the right of the Campaign Brief card
    positionTourTooltipStep2(tooltip, targetElement);
    console.log('Tooltip positioned');
    
    // Set up canvas movement tracking
    setupTooltipTracking(tooltip, targetElement);
    console.log('Tooltip tracking setup complete');
}

function positionTourTooltipStep2(tooltip, targetElement) {
    console.log('Positioning tooltip for element:', targetElement);
    const targetRect = targetElement.getBoundingClientRect();
    console.log('Target element rect:', targetRect);
    
    // Position to the right of the target element, attached more at the top
    const left = targetRect.right + 20;
    const top = targetRect.top + 8; // Attach near the top with 8px offset

    console.log('Calculated position - left:', left, 'top:', top);
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    console.log('Tooltip positioned at:', tooltip.style.left, tooltip.style.top);
    console.log('Tooltip final styles:', {
        left: tooltip.style.left,
        top: tooltip.style.top,
        display: tooltip.style.display,
        visibility: tooltip.style.visibility,
        opacity: tooltip.style.opacity
    });
}

function panToElement(element, callback, alignTop = false) {
    const canvasContainer = document.getElementById('canvasContainer');
    const canvasViewport = document.getElementById('canvasViewport');
    
    if (!canvasContainer || !canvasViewport || !element) {
        if (callback) callback();
        return;
    }
    
    // Get element position relative to the viewport
    const elementRect = element.getBoundingClientRect();
    const containerRect = canvasContainer.getBoundingClientRect();
    
    // Calculate the center of the canvas container
    const containerCenterX = containerRect.left + containerRect.width / 2;
    // const containerCenterY = containerRect.top + containerRect.height / 2;
    
    // Calculate the center of the element
    const elementCenterX = elementRect.left + elementRect.width / 2;
    // const elementCenterY = elementRect.top + elementRect.height / 2;
    
    // Calculate how much we need to move to center the element horizontally
    let deltaX = containerCenterX - elementCenterX;
    let targetX = currentX + deltaX;
    let targetY;
    
    if (alignTop) {
        // Align the top of the element with the top of the container, plus 64px offset (header is 48px)
        const elementTop = elementRect.top;
        const containerTop = containerRect.top;
        const verticalOffset = 64; // 48px header + 16px buffer
        targetY = currentY + (containerTop + verticalOffset - elementTop);
        // Pan slightly more to the left (e.g., -40px)
        targetX -= 40;
    } else {
        // Center vertically (default behavior)
        const containerCenterY = containerRect.top + containerRect.height / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
        const deltaY = containerCenterY - elementCenterY;
        targetY = currentY + deltaY;
    }
    
    // Animate to the new position
    animateCanvasTo(targetX, targetY, 800, callback);
}

function setupTooltipTracking(tooltip, targetElement) {
    // Store the original updateCanvasPosition function
    if (!window.originalUpdateCanvasPosition) {
        window.originalUpdateCanvasPosition = updateCanvasPosition;
    }
    
    // Override updateCanvasPosition to also update tooltip position
    window.updateCanvasPosition = function() {
        // Call original function
        window.originalUpdateCanvasPosition();
        
        // Update tooltip position if it exists and is attached
        const attachedTooltip = document.querySelector('.tour-tooltip-attached');
        if (attachedTooltip && attachedTooltip.targetElement) {
            positionTourTooltipStep2(attachedTooltip, attachedTooltip.targetElement);
        }
    };
}

function removeTooltipTracking() {
    // Restore original updateCanvasPosition function
    if (window.originalUpdateCanvasPosition) {
        window.updateCanvasPosition = window.originalUpdateCanvasPosition;
    }
}

function goToTourStep3() {
    console.log('🐛 DEBUG: goToTourStep3 updated function called - Blog Post reset');
    // Remove existing tooltip
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
    
    // Remove highlight from all previously highlighted elements
    const allHighlightedElements = document.querySelectorAll('.tour-highlight');
    allHighlightedElements.forEach(element => {
        element.classList.remove('tour-highlight');
    });

    // Find and highlight the Blog Post card (reset to beginning)
    const blogPostCard = document.querySelector('#tour-blog-post-card');
    if (!blogPostCard) {
        console.error('Blog post card not found for tour!');
        return;
    }
    blogPostCard.classList.add('tour-highlight');

    // Pan to the element if needed and show the new tooltip
    panToElement(blogPostCard, () => {
        showBlogPostTooltip(blogPostCard);
    }, true);
}

function showBlogPostTooltip(targetElement) {
    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // Create tooltip for this new step
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip tour-tooltip-attached';
    tooltip.innerHTML = `
        <div class="tour-tooltip-content">
            <button class="tour-tooltip-close" onclick="closeTour()">&times;</button>
            <h3 class="tour-tooltip-title">Step 3: Use existing assets as context to create the next one</h3>
            <p class="tour-tooltip-body">Select the Campaign Brief document and either open another App or use our Chat to create a context-aware blog post.</p>
            <div class="tour-tooltip-actions">
                <button class="tour-back-btn" onclick="goBackToTourStep2()">Back</button>
                <button class="tour-next-btn" onclick="showCampaignBriefChatDemo()">Show me how</button>
            </div>
        </div>
        <div class="tour-tooltip-arrow"></div>
    `;
    document.body.appendChild(tooltip);

    tooltip.targetElement = targetElement;
    positionTourTooltipStep2(tooltip, targetElement); // Re-use existing positioning logic
    setupTooltipTracking(tooltip, targetElement); // Re-use existing tracking logic
}

function showCampaignBriefChatDemo() {
    console.log('=== showCampaignBriefChatDemo started ===');
    
    // 1. Remove the tooltip first
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();
    
    // Gentle canvas adjustment to better showcase the demo
    const canvasViewport = document.getElementById('canvasViewport');
    if (canvasViewport) {
        // Pan 150px to the left from current position (reduced from 300px)
        const newX = currentX + 150;
        animateCanvasTo(newX, currentY, 600);
    }
    
    // Add delay before highlighting campaign brief
    setTimeout(() => {
        // 2. Remove highlight from ALL possible blog post selectors
    console.log('Looking for blog post cards to remove highlights...');
    
    // Try multiple selectors for blog post
    const blogPostSelectors = ['.blog-post', '.asset-card.blog-post', '[class*="blog"]', '.website-blog .asset-card'];
    let blogPostFound = false;
    
    blogPostSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`Selector "${selector}" found ${elements.length} elements:`, elements);
        elements.forEach((element, index) => {
            console.log(`  Element ${index} classes before:`, element.className);
            element.classList.remove('tour-highlight', 'highlight', 'highlighted');
            console.log(`  Element ${index} classes after:`, element.className);
            blogPostFound = true;
        });
    });
    
    // Also remove highlights from ALL cards as a fallback
    const allHighlightedCards = document.querySelectorAll('.tour-highlight, .highlight');
    console.log('All currently highlighted cards:', allHighlightedCards);
    allHighlightedCards.forEach((card, index) => {
        console.log(`Removing highlight from card ${index}:`, card.className);
        card.classList.remove('tour-highlight', 'highlight', 'highlighted');
        console.log(`Card ${index} after removal:`, card.className);
    });
    
    if (!blogPostFound) {
        console.log('No blog post cards found with any selector - listing all cards:');
        const allCards = document.querySelectorAll('.asset-card, .card, [class*="card"]');
        allCards.forEach((card, index) => {
            console.log(`Card ${index}:`, card.className, card);
        });
    }
    
    // 3. Highlight Campaign Brief
    const campaignBriefCard = document.querySelector('.campaign-brief');
    console.log('Campaign brief card found:', campaignBriefCard);
    if (campaignBriefCard) {
        campaignBriefCard.classList.add('tour-highlight');
        console.log('Added highlight to campaign brief');
        
        // Pan canvas to better show the campaign brief document
        panToCampaignBrief(campaignBriefCard);
        
        // Add the campaign brief pill to the chat immediately
        addCampaignBriefPillToChat();
    } else {
        console.log('Campaign brief card not found - checking all cards');
        const allCards = document.querySelectorAll('.card');
        console.log('All cards found:', allCards);
        allCards.forEach((card, index) => {
            console.log(`Card ${index}:`, card.className, card);
        });
    }

        // 3. After a delay, change the "Ask jasper anything" text and show Voilà tooltip
        setTimeout(() => {
            updateChatInputText();
        }, 800);
    }, 700); // Wait 700ms after canvas pan (which takes 600ms) before highlighting
}

function panToCampaignBrief(campaignBriefCard) {
    console.log('panToCampaignBrief called with:', campaignBriefCard);
    
    // Get current canvas position
    const canvas = document.querySelector('.canvas');
    const canvasViewport = document.getElementById('canvasViewport');
    
    if (!canvas || !canvasViewport) {
        console.log('Canvas or viewport not found');
        return;
    }
    
    console.log('Canvas and viewport found');
    
    // Get the campaign brief card position relative to the viewport
    const cardRect = campaignBriefCard.getBoundingClientRect();
    const viewportRect = canvasViewport.getBoundingClientRect();
    
    console.log('Card rect:', cardRect);
    console.log('Viewport rect:', viewportRect);
    
    // Get current transform values
    const currentTransform = canvasViewport.style.transform || 'translate(0px, 0px) scale(1)';
    console.log('Current transform:', currentTransform);
    
    const transformMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
    
    let currentX = transformMatch ? parseFloat(transformMatch[1]) || 0 : 0;
    let currentY = transformMatch ? parseFloat(transformMatch[2]) || 0 : 0;
    let currentScale = scaleMatch ? parseFloat(scaleMatch[1]) || 1 : 1;
    
    console.log('Current position:', currentX, currentY, 'Scale:', currentScale);
    
    // Calculate the center of the viewport
    const viewportCenterX = viewportRect.width / 2;
    const viewportCenterY = viewportRect.height / 2;
    
    // Calculate the center of the card relative to the viewport
    const cardCenterX = cardRect.left - viewportRect.left + (cardRect.width / 2);
    const cardCenterY = cardRect.top - viewportRect.top + (cardRect.height / 2);
    
    // Calculate how much to move to center the card
    const deltaX = viewportCenterX - cardCenterX;
    const deltaY = viewportCenterY - cardCenterY;
    
    // Apply the delta to current position
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
    
    console.log('Centering calculation:');
    console.log('  Viewport center:', viewportCenterX, viewportCenterY);
    console.log('  Card center:', cardCenterX, cardCenterY);
    console.log('  Delta:', deltaX, deltaY);
    console.log('  New position:', newX, newY);
    
    // Animate the canvas pan to center the campaign brief
    animateCanvasTo(newX, newY, 600);
}

function addCampaignBriefPillToChat() {
    // Find the input container (inside the chat input)
    const inputContainer = document.querySelector('.chat-input .input-container');
    if (!inputContainer) return;

    // Create the campaign brief pill
    const pill = document.createElement('div');
    pill.className = 'context-pill-demo';
    pill.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: #3B82F6;
        color: white;
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 500;
        opacity: 1;
        transform: translateY(0);
        position: absolute;
        left: 12px;
        top: 12px;
        z-index: 20;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        cursor: default;
    `;
    pill.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="12" height="12" rx="2"/>
        </svg>
        <span>Campaign Brief</span>
        <span style="margin-left: 4px; cursor: pointer; opacity: 0.8; font-size: 10px; padding: 0 2px;">×</span>
    `;

    // Make the input container relative for positioning
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(pill);

    // Adjust the textarea to make room for the pill at the top
    const inputField = inputContainer.querySelector('.input-field');
    
    if (inputField) {
        // Adjust padding to make room for pill at top and move text below
        inputField.style.paddingLeft = '0px';
        inputField.style.paddingTop = '28px'; // Reduced space for smaller pill + gap
        inputField.style.paddingBottom = '16px';
        inputField.style.paddingRight = '16px';
        inputField.style.minHeight = '60px';
        inputField.style.boxSizing = 'border-box';
        inputField.style.resize = 'none';
        inputField.style.lineHeight = '1.5';
        inputField.style.fontSize = '14px'; // Match Jasper message font size
    }

    // Pill appears immediately without animation

    // Update input field placeholder
    if (inputField) {
        inputField.placeholder = 'Create multiple Instagram posts with targeted messaging.';
    }

    // Add click handler for the close button
    const closeBtn = pill.querySelector('span:last-child');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeCampaignBriefPill();
        });
    }
    

}

function removeCampaignBriefPill() {
    const pill = document.querySelector('.context-pill-demo');
    const inputField = document.querySelector('.chat-input .input-field');
    const campaignBrief = document.getElementById('generatedCampaignBrief');
    
    if (pill) {
        // Remove immediately without animation
        pill.remove();
    }
    
    // Remove selected class from campaign brief
    if (campaignBrief) {
        campaignBrief.classList.remove('selected');
    }
    
    if (inputField) {
        // Reset input field styling to default state
        inputField.style.paddingLeft = '0px';
        inputField.style.paddingTop = '0px';
        inputField.style.paddingBottom = '0px';
        inputField.style.paddingRight = '0px';
        inputField.style.minHeight = '60px';
        inputField.style.fontSize = '14px'; // Keep consistent font size
        inputField.style.lineHeight = '1.5';
        
        // Reset placeholder
        inputField.placeholder = 'Ask Jasper anything...';
    }
}

function updateChatInputText() {
    console.log('updateChatInputText called');
    
    // Find the chat input textarea (it's actually a textarea, not input)
    const chatInputField = document.querySelector('.chat-input .input-field');
    const chatInputTextarea = document.querySelector('.chat-input textarea');
    
    console.log('Found textarea field:', chatInputField);
    console.log('Found textarea element:', chatInputTextarea);
    
    const targetText = 'Create a blog post using this Campaign Brief as context.';
    
    // Function to simulate typing animation
    function typeText(element, text, speed = 30) {
        if (!element) return Promise.resolve();
        
        element.placeholder = ''; // Clear current placeholder
        
        // Make placeholder text black during typing
        const originalColor = element.style.color;
        element.style.setProperty('color', '#000000', 'important');
        
        // Add CSS to make placeholder black
        const style = document.createElement('style');
        style.textContent = `
            .input-field::placeholder {
                color: #000000 !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
        
        let i = 0;
        
        return new Promise((resolve) => {
            function type() {
                if (i < text.length) {
                    element.placeholder += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }
    
    // Apply typing animation to both elements (whichever exists)
    const elementToAnimate = chatInputField || chatInputTextarea;
    
    if (elementToAnimate) {
        console.log('Starting typing animation');
        typeText(elementToAnimate, targetText, 25).then(() => {
            console.log('Typing animation complete');
            
            // Show the "Voilà!" tooltip pointing at the chat sidebar after a delay
            setTimeout(() => {
                showVoilaTooltip();
            }, 1000); // 1 second delay to allow users to see the animation and context changes
        });
    } else {
        // Fallback if no element found
        setTimeout(() => {
            showVoilaTooltip();
        }, 1000);
    }
}

function showVoilaTooltip() {
    // Remove any existing tooltips first
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) existingTooltip.remove();
    
    // Find the chat sidebar to point at
    const chatSidebar = document.querySelector('.chat-sidebar');
    if (!chatSidebar) return;
    
    // Create the tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.innerHTML = `
        <div class="tour-tooltip-content">
            <button class="tour-tooltip-close" onclick="closeVoilaTooltip()">&times;</button>
            <h3 class="tour-tooltip-title">Voilà!</h3>
            <p class="tour-tooltip-body">Recap: The Campaign Brief was selected in Canvas and used as context in chat to create a blog post.</p>
            <div class="tour-tooltip-actions">
                <button class="tour-next-btn" onclick="goToStep4FromVoila()">Next</button>
            </div>
        </div>
        <div class="tour-tooltip-arrow"></div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position the tooltip to the right of the chat sidebar
    positionVoilaTooltip(tooltip, chatSidebar);
    
    // Set up tracking for responsive positioning
    setupVoilaTooltipTracking(tooltip, chatSidebar);
}

function positionVoilaTooltip(tooltip, chatSidebar) {
    const sidebarRect = chatSidebar.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Find the chat input to position tooltip closer to it
    const chatInput = document.querySelector('.chat-input');
    const chatInputRect = chatInput ? chatInput.getBoundingClientRect() : null;
    
    // Position to the right of the chat sidebar, but closer to the chat input
    const left = sidebarRect.right + 20; // 20px gap from sidebar
    let top;
    
    if (chatInputRect) {
        // Position the tooltip to align with the chat input area
        top = chatInputRect.top - (tooltipRect.height / 2) + (chatInputRect.height / 2);
        // Adjust upward a bit to be more visually connected to the input
        top -= 20;
    } else {
        // Fallback to original centering
        top = sidebarRect.top + (sidebarRect.height / 2) - (tooltipRect.height / 2);
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = Math.max(20, top) + 'px'; // Ensure it doesn't go above viewport
    
    // Position the arrow to point left (towards the sidebar)
    const arrow = tooltip.querySelector('.tour-tooltip-arrow');
    if (arrow) {
        arrow.style.left = '-8px';
        arrow.style.top = '50%';
        arrow.style.transform = 'translateY(-50%) rotate(45deg)';
        arrow.style.border = 'none';
        arrow.style.backgroundColor = '#FFFFFF';
    }
}

function setupVoilaTooltipTracking(tooltip, chatSidebar) {
    const updatePosition = () => positionVoilaTooltip(tooltip, chatSidebar);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    // Store cleanup function
    tooltip._cleanup = () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
    };
}

function closeVoilaTooltip() {
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) {
        if (tooltip._cleanup) tooltip._cleanup();
        tooltip.remove();
    }
}

function goToStep4FromVoila() {
    // Close the current Voilà tooltip
    closeVoilaTooltip();
    
    // Remove campaign brief pill and reset chat input to default state
    resetChatInputToDefault();
    
    // Start Step 4 of the tour
    startTourStep4();
}

function resetChatInputToDefault() {
    // Remove highlights from all cards - try multiple selectors and classes
    const allCards = document.querySelectorAll('.card, .blog-post, .campaign-brief, .asset-card, .app-card');
    allCards.forEach((card, index) => {
        console.log(`Card ${index} classes before:`, card.className);
        card.classList.remove('tour-highlight', 'highlight', 'highlighted', 'selected');
        console.log(`Card ${index} classes after:`, card.className);
    });
    
    // Also try specific selectors with more thorough class removal
    const blogPostCard = document.querySelector('.blog-post');
    if (blogPostCard) {
        console.log('Blog post card classes before:', blogPostCard.className);
        // Remove all possible highlight classes
        blogPostCard.classList.remove('tour-highlight', 'highlight', 'highlighted', 'selected');
        // Force remove any remaining highlight-related classes
        blogPostCard.className = blogPostCard.className.replace(/\b(tour-)?highlight(ed)?\b/g, '').trim();
        console.log('Blog post card classes after:', blogPostCard.className);
    }
    
    const campaignBriefCard = document.querySelector('.campaign-brief');
    if (campaignBriefCard) {
        console.log('Campaign brief card classes before:', campaignBriefCard.className);
        campaignBriefCard.classList.remove('tour-highlight', 'highlight', 'highlighted', 'selected');
        // Force remove any remaining highlight-related classes
        campaignBriefCard.className = campaignBriefCard.className.replace(/\b(tour-)?highlight(ed)?\b/g, '').trim();
        console.log('Campaign brief card classes after:', campaignBriefCard.className);
    }
    
    // Remove the campaign brief pill using the new function
    removeCampaignBriefPill();
    
    // Reset input field placeholder
    const inputField = document.querySelector('.chat-input .input-field');
    if (inputField) {
        inputField.placeholder = 'Ask Jasper anything...'; // Reset to default placeholder
    }
}

function restartModalAnimation() {
    // 1. Remove any existing tooltips
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();

    // 2. Remove the large app modal
    const appModal = document.querySelector('.app-modal');
    if (appModal) {
        appModal.classList.remove('visible');
        setTimeout(() => appModal.remove(), 600);
    }
    
    // 3. Remove the small fly-in modal from the toolbar
    const flyInModal = document.querySelector('.inline-flyin-modal');
    if (flyInModal) flyInModal.remove();

    // 4. Restart the animation after a short delay to allow modals to close
    setTimeout(() => {
        showAppModalAnimation();
    }, 300);
}

function showAppModalAnimation() {
    // This is the renamed function that contains the logic
    // from the old closeTourStep2 function.
    
    // Find the cube icon in the action bar
    const cubeBtn = document.querySelector('.action-bar .cube-btn');
    if (!cubeBtn) return;
    const cubeRect = cubeBtn.getBoundingClientRect();
    const actionBar = document.querySelector('.action-bar');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const modalWidth = 480;
    const modalHeight = 220;
    let bottomOffset = 40;
    if (actionBar) {
        const actionBarRect = actionBar.getBoundingClientRect();
        bottomOffset = (vh - actionBarRect.top) + 8; // 8px above the action bar
    }
    // Calculate horizontal center based on cube icon
    const modalLeft = Math.round(cubeRect.left + cubeRect.width/2 - modalWidth/2);
    const modalTop = vh - bottomOffset - modalHeight;

    // Create the modal element
    const modal = document.createElement('div');
    modal.className = 'inline-flyin-modal app-library-modal';
    modal.style.position = 'fixed';
    modal.style.left = modalLeft + 'px';
    modal.style.top = (vh - bottomOffset) + 'px'; // Start at the bottom, just above the action bar
    modal.style.width = modalWidth + 'px';
    modal.style.height = modalHeight + 'px';
    modal.style.background = '#fff';
    modal.style.borderRadius = '16px';
    modal.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
    modal.style.zIndex = 20000;
    modal.style.overflow = 'hidden';
    modal.style.transition = 'all 0.5s cubic-bezier(.4,1,.4,1)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(40px)';
    modal.innerHTML = `
        <div class="app-card">
            <div class="app-card-header">
                <div class="app-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m17 2 4 4-4 4"/>
                        <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
                        <path d="m7 22-4-4 4-4"/>
                        <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
                    </svg>
                </div>
                <div class="app-card-tag">Popular</div>
            </div>
            <div class="app-card-body">
                <h3 class="app-card-title">Campaign Brief</h3>
                <p class="app-card-description">Create comprehensive campaign briefs that outline strategy, messaging, and key deliverables</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Animate to just above the action bar (slide up)
    setTimeout(() => {
        modal.style.top = modalTop + 'px';
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    }, 10);

    // Optional: close modal on click outside
    setTimeout(() => {
        // --- Start of new animation sequence ---
        
        // 1. Highlight the card after a shorter delay
        setTimeout(() => {
            const card = modal.querySelector('.app-card');
            if (card) {
                card.classList.add('highlight');
            }
        }, 200);

        // 2. Show the new App Modal after another delay
        setTimeout(() => {
            showCampaignBriefModal();
        }, 1600);

        // --- End of new animation sequence ---

        function closeModalOnClick(e) {
            if (!modal.contains(e.target)) {
                modal.remove();
                document.removeEventListener('mousedown', closeModalOnClick);
            }
        }
        document.addEventListener('mousedown', closeModalOnClick);
        // We no longer show the 3rd tooltip here immediately
        // showThirdTourTooltip(modal);
    }, 500);
}

function showCampaignBriefModal() {
    // Close the small toolbar modal as this one opens
    const toolbarModal = document.querySelector('.inline-flyin-modal');
    if (toolbarModal) {
        toolbarModal.style.opacity = '0';
        toolbarModal.style.transform = 'translateY(40px)';
        setTimeout(() => toolbarModal.remove(), 500);
    }

    // 1. Create the modal element
    const appModal = document.createElement('div');
    appModal.className = 'app-modal';
    appModal.innerHTML = `
        <div class="app-modal-header">
            <div class="app-modal-title-group">
                <div class="app-modal-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </div>
                <span class="app-modal-title">Campaign Brief</span>
            </div>
            <div class="app-modal-actions">
                 <button class="app-modal-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg></button>
                 <button class="app-modal-btn"><svg width="18" height="18" viewBox="0 0 16 16"><path fill="currentColor" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM2 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm14 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></button>
                <button class="app-modal-btn" onclick="this.closest('.app-modal').remove()"><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M12.7.3a1 1 0 0 1 0 1.4L9.4 5l3.3 3.3a1 1 0 0 1-1.4 1.4L8 6.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L6.6 5 3.3 1.7a1 1 0 0 1 1.4-1.4L8 3.6l3.3-3.3a1 1 0 0 1 1.4 0z"/></svg></button>
            </div>
        </div>
        <div class="app-modal-body">
            <p class="app-modal-description">Create comprehensive campaign briefs that outline strategy, messaging, and key deliverables</p>
            <div class="form-section">
                 <div class="dropdown-field">
                    <span class="form-section-value">Whisker Voice • Pet parents • English... • 1...</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 6l4 4 4-4"/></svg>
                </div>
            </div>
            <div class="form-section">
                <div class="form-section-header">Add project assets for context</div>
            </div>
            <div class="dropdown-field">
                <span class="form-section-title">Topic</span>
                <span class="form-section-value">Whisker & Tails Summer Flavors</span>
            </div>
            <div class="dropdown-field">
                <span class="form-section-title">Outline</span>
                <span class="form-section-value">I. Introduction - Briefly introduce...</span>
            </div>
            <div class="dropdown-field">
                <span class="form-section-title">Create an image</span>
                <span class="form-section-value">Based on information provided</span>
            </div>
        </div>
        <div class="app-modal-footer">
            <button class="generate-btn">Generate now</button>
        </div>
    `;
    document.body.appendChild(appModal);

    // 2. Animate it into view
    setTimeout(() => {
        appModal.classList.add('visible');
    }, 10);

    // 3. Show the 3rd tooltip next to this new modal after a longer delay
    setTimeout(() => {
        showThirdTourTooltip(appModal);
    }, 1200); // 1.2 second delay to allow users to see the modal animation and content
}

function showThirdTourTooltip(modal) {
    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) existingTooltip.remove();
    
    // Also remove highlight from the blog post card
    const blogPostCard = document.querySelector('#tour-blog-post-card');
    if (blogPostCard) {
        blogPostCard.classList.remove('tour-highlight');
    }

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip tour-tooltip-attached';
    tooltip.innerHTML = `
        <div class="tour-tooltip-content">
            <h3 class="tour-tooltip-title">Here's a Campaign Brief App</h3>
            <p class="tour-tooltip-body">By using an App, you have Jasper's marketing best practices already applied.</p>
            <div class="tour-tooltip-actions">
                <button class="tour-next-btn" onclick="closeThirdTourTooltip()">Next</button>
            </div>
        </div>
        <div class="tour-tooltip-arrow arrow-top"></div>
    `;
    document.body.appendChild(tooltip);

    // Position the tooltip vertically centered and close to the modal
    function positionTooltip() {
        const modalRect = modal.getBoundingClientRect();
        const tooltipWidth = 280;
        const tooltipHeight = 120;
        // Vertically center and bring close (28px gap)
        const left = modalRect.right + 28;
        const top = modalRect.top + (modalRect.height / 2) - (tooltipHeight / 2);
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.width = tooltipWidth + 'px';
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }
    positionTooltip();
    window.addEventListener('resize', positionTooltip);
    // Store for tracking
    tooltip.targetElement = modal;
}

function closeThirdTourTooltip() {
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();

    // Also close the main App Modal
    const appModal = document.querySelector('.app-modal');
    if (appModal) {
        appModal.classList.remove('visible');
        setTimeout(() => appModal.remove(), 200); // Match CSS transition
    }

    // Go to tour step 3
    goToTourStep3();
}

function startTourStep4() {
    // Find and highlight the Social Media Assets group
    const socialMediaGroup = document.querySelector('.social-media .asset-cards-row');
    if (!socialMediaGroup) {
        console.error('Social media group not found!');
        return;
    }
    socialMediaGroup.classList.add('tour-highlight');

    // Zoom out to 60%
    scale = 0.6;
    updateCanvasPosition();
    updateZoomLevel();

    // Pan canvas to center the group
    panToElement(socialMediaGroup, () => {
        showTourTooltipStep4(socialMediaGroup);
    }, true);
}

function showTourTooltipStep4(targetElement) {
    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) existingTooltip.remove();

    // Create tooltip for step 4
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip tour-tooltip-attached';
    tooltip.innerHTML = `
        <div class="tour-tooltip-content">
            <button class="tour-tooltip-close" onclick="closeTour()">&times;</button>
            <h3 class="tour-tooltip-title">Step 4: Create multiple assets at once</h3>
            <p class="tour-tooltip-body">Scale your generations by creating multiple Instagram posts at once with targeted messaging that aligns with your campaign strategy and brand voice</p>
            <div class="tour-tooltip-actions">
                <button class="tour-back-btn" onclick="goBackToTourStep3()">Back</button>
                <button class="tour-next-btn" onclick="closeTourStep4()">Next</button>
            </div>
        </div>
        <div class="tour-tooltip-arrow arrow-right"></div>
    `;
    document.body.appendChild(tooltip);
    tooltip.targetElement = targetElement;
    positionTourTooltipBelow(tooltip, targetElement);
    setupTooltipTrackingBelow(tooltip, targetElement);
}

function positionTourTooltipBelow(tooltip, targetElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 160;
    // Center horizontally below the group, with 18px gap
    const left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
    const top = targetRect.bottom + 18;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.width = tooltipWidth + 'px';
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
}

function setupTooltipTrackingBelow(tooltip, targetElement) {
    if (!window.originalUpdateCanvasPositionBelow) {
        window.originalUpdateCanvasPositionBelow = updateCanvasPosition;
    }
    window.updateCanvasPosition = function() {
        window.originalUpdateCanvasPositionBelow();
        const attachedTooltip = document.querySelector('.tour-tooltip-attached');
        if (attachedTooltip && attachedTooltip.targetElement) {
            positionTourTooltipBelow(attachedTooltip, attachedTooltip.targetElement);
        }
    };
}

function closeTourStep4() {
    // Remove tooltip tracking
    removeTooltipTracking();
    // Remove tooltip
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();
    // Remove highlight from social media group
    const socialMediaGroup = document.querySelector('.social-media .asset-cards-row');
    if (socialMediaGroup) socialMediaGroup.classList.remove('tour-highlight');
    
    // Show the toolbar above the website section
    const bulkEditToolbar = document.querySelector('.bulk-edit-toolbar');
    console.log('Toolbar element found:', bulkEditToolbar);
    if (bulkEditToolbar) {
        bulkEditToolbar.style.display = 'flex';
        console.log('Toolbar display set to flex');
        console.log('Toolbar styles:', window.getComputedStyle(bulkEditToolbar));
    } else {
        console.log('Toolbar element not found!');
    }
    
    // Minimal canvas adjustment - only pan to show the website section without excessive movement
    const canvasViewport = document.getElementById('canvasViewport');
    if (canvasViewport) {
        const currentTransform = canvasViewport.style.transform || 'translate(0px, 0px) scale(1)';
        const transformMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
        
        let currentX = transformMatch ? parseFloat(transformMatch[1]) : 0;
        let currentY = transformMatch ? parseFloat(transformMatch[2]) : 0;
        let currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        
        // Gentle pan right by 150px and up by 50px (reduced from 300px/100px)
        const newX = currentX - 150;
        const newY = currentY - 50;
        
        canvasViewport.style.transform = `translate(${newX}px, ${newY}px) scale(${currentScale})`;
        updateCanvasPosition();
    }
    
    // Start the 5th tour step
    startTourStep5();
}

function startTourStep5() {
    // Find and highlight the Website and Blog group
    const websiteBlogGroup = document.querySelector('.website-blog .asset-cards-row');
    if (!websiteBlogGroup) return;
    websiteBlogGroup.classList.add('tour-highlight');

    // Minimal adjustment to accommodate the toolbar without excessive movement
    const canvasViewport = document.getElementById('canvasViewport');
    if (canvasViewport) {
        const currentTransform = canvasViewport.style.transform || 'translate(0px, 0px) scale(1)';
        const transformMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
        
        let currentX = transformMatch ? parseFloat(transformMatch[1]) : 0;
        let currentY = transformMatch ? parseFloat(transformMatch[2]) : 0;
        let currentScale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        
        // Gentle adjustment: pan left by 50px and down by 75px (reduced from 100px/150px)
        const newX = currentX - 50;
        const newY = currentY + 75;
        
        canvasViewport.style.transform = `translate(${newX}px, ${newY}px) scale(${currentScale})`;
    }

    // Pan canvas to center the group (same as previous tooltips)
    panToElement(websiteBlogGroup, () => {
        showTourTooltipStep5(websiteBlogGroup);
    }, true);
}

function showTourTooltipStep5(targetElement) {
    // Remove any existing tooltip
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) existingTooltip.remove();

    // Create tooltip for step 5
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip tour-tooltip-attached';
    tooltip.innerHTML = `
        <div class="tour-tooltip-content">
            <button class="tour-tooltip-close" onclick="closeTour()">&times;</button>
            <h3 class="tour-tooltip-title">Step 5: Edit assets in bulk</h3>
            <p class="tour-tooltip-body">Use the toolbar or chat to quickly edit multiple assets at once</p>
            <div class="tour-tooltip-actions">
                <button class="tour-back-btn" onclick="goBackToTourStep4()">Back</button>
                <button class="tour-next-btn" onclick="closeTourStep5()">Finish</button>
            </div>
        </div>
        <div class="tour-tooltip-arrow arrow-right"></div>
    `;
    document.body.appendChild(tooltip);
    tooltip.targetElement = targetElement;
    positionTourTooltipRight(tooltip, targetElement);
    setupTooltipTrackingRight(tooltip, targetElement);
}

function positionTourTooltipRight(tooltip, targetElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 160;
    // Position to the right of the group, vertically centered
    const left = targetRect.right + 18;
    const top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.width = tooltipWidth + 'px';
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
}

function setupTooltipTrackingRight(tooltip, targetElement) {
    if (!window.originalUpdateCanvasPositionRight) {
        window.originalUpdateCanvasPositionRight = updateCanvasPosition;
    }
    window.updateCanvasPosition = function() {
        window.originalUpdateCanvasPositionRight();
        const attachedTooltip = document.querySelector('.tour-tooltip-attached');
        if (attachedTooltip && attachedTooltip.targetElement) {
            positionTourTooltipRight(attachedTooltip, attachedTooltip.targetElement);
        }
    };
}

function closeTourStep5() {
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
    removeTooltipTracking();

    // Add more delay before the final Jasper message appears
    setTimeout(() => {
        const finalMessage = `When you're ready, start your own project in a new tab. You can also explore more projects in our community.
                <button 
                    onclick="createNewProject()" 
                    style="
                        background: #F3F4F6; 
                        color: #4B5563; 
                        border: 1px solid #E5E7EB; 
                        padding: 8px 14px; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        font-weight: 500;
                        margin-top: 12px;
                        display: block;
                        width: 100%;
                        text-align: center;
                        transition: background-color 0.2s;
                    "
                    onmouseover="this.style.background='#E5E7EB'"
                    onmouseout="this.style.background='#F3F4F6'"
                >
                    Create project
                </button>
                <a 
                    href="#" 
                    onclick="visitCommunity()" 
                    style="
                        color: #3B82F6; 
                        text-decoration: underline; 
                        cursor: pointer; 
                        font-size: 14px;
                        margin-top: 8px;
                        display: block;
                        text-align: center;
                        transition: color 0.2s;
                    "
                    onmouseover="this.style.color='#2563EB'"
                    onmouseout="this.style.color='#3B82F6'"
                >
                    Visit the Community
                </a>`;
        
        // Use custom styling for the final message (no gray background, black text)
        addCustomFinalMessage('Jasper', finalMessage);
    }, 1200); // Increased delay from 500ms to 1200ms
}

function createNewProject() {
    // Placeholder for creating a new project
    console.log('Creating new project...');
}

function visitCommunity() {
    // Placeholder for visiting the community
    console.log('Visiting community...');
    // You can replace this with the actual community URL
    // window.open('https://community.jasper.ai', '_blank');
}

function addCustomFinalMessage(author, message) {
    const chatContent = document.querySelector('.chat-content');
    const greeting = document.querySelector('.jasper-greeting');
    
    // Hide greeting if this is the first message
    if (greeting && greeting.style.display !== 'none') {
        greeting.style.display = 'none';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    // Custom styling with no background and black text
    messageDiv.style.cssText = `
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 8px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
        margin-right: 20px;
    `;
    
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <div class="jasper-avatar"></div>
            <span style="font-size: 13px; font-weight: 600; color: #262627;">${author}</span>
        </div>
        <div style="font-size: 14px; line-height: 1.5; color: #000000;">${message}</div>
    `;
    
    chatContent.appendChild(messageDiv);
    
    // Animate in with smooth transition
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Scroll to bottom with smooth animation
    setTimeout(() => {
        chatContent.scrollTop = chatContent.scrollHeight;
    }, 200);
}

// Back navigation functions for tour
function goBackToTourStep1() {
    // Remove current tooltip
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();
    
    // Remove highlight from campaign brief
    const campaignBriefCard = document.querySelector('.campaign-brief');
    if (campaignBriefCard) campaignBriefCard.classList.remove('tour-highlight');
    
    // Show project settings modal again
    showProjectSettings();
    
    // Show step 1 tooltip after modal appears
    setTimeout(() => {
        showTourTooltip();
    }, 300);
}

function goBackToTourStep2() {
    // Remove current tooltip
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();
    
    // Find and highlight the Campaign Brief card
    const campaignBriefCard = document.querySelector('.campaign-brief');
    if (campaignBriefCard) {
        campaignBriefCard.classList.add('tour-highlight');
        
        // Pan to the element and show step 2 tooltip
        panToElement(campaignBriefCard, () => {
            showTourTooltipStep2(campaignBriefCard);
        }, true);
    }
}

function goBackToTourStep3() {
    console.log('🐛 DEBUG: goBackToTourStep3 updated function called - Blog Post reset');
    // Remove current tooltip
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();
    
    // Remove highlight from all previously highlighted elements
    const allHighlightedElements = document.querySelectorAll('.tour-highlight');
    allHighlightedElements.forEach(element => {
        element.classList.remove('tour-highlight');
    });
    
    // Find and highlight the Blog Post card (reset to beginning)
    const blogPostCard = document.querySelector('#tour-blog-post-card');
    if (!blogPostCard) {
        console.error('Blog post card not found for tour!');
        return;
    }
    blogPostCard.classList.add('tour-highlight');
    
    // Pan to the element and show step 3 tooltip
    panToElement(blogPostCard, () => {
        showBlogPostTooltip(blogPostCard);
    }, true);
}

function goBackToTourStep4() {
    // Remove current tooltip
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();
    
    // Remove highlight from website blog group
    const websiteBlogGroup = document.querySelector('.website-blog .asset-cards-row');
    if (websiteBlogGroup) websiteBlogGroup.classList.remove('tour-highlight');
    
    // Hide the bulk edit toolbar
    const bulkEditToolbar = document.querySelector('.bulk-edit-toolbar');
    if (bulkEditToolbar) {
        bulkEditToolbar.style.display = 'none';
    }
    
    // Find and highlight the social media group
    const socialMediaGroup = document.querySelector('.social-media .asset-cards-row');
    if (socialMediaGroup) {
        socialMediaGroup.classList.add('tour-highlight');
        
        // Pan to the element and show step 4 tooltip
        panToElement(socialMediaGroup, () => {
            showTourTooltipStep4(socialMediaGroup);
        }, true);
    }
}

// Close/stop tour function
function closeTour() {
    // Remove any existing tooltip
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) tooltip.remove();
    
    // Remove tooltip tracking
    removeTooltipTracking();
    
    // Remove all tour highlights
    const highlightedElements = document.querySelectorAll('.tour-highlight');
    highlightedElements.forEach(element => {
        element.classList.remove('tour-highlight');
    });
    
    // Close any open modals
    const projectModal = document.querySelector('.project-settings-modal');
    if (projectModal) {
        closeProjectSettings();
    }
    
    const appModal = document.querySelector('.app-modal');
    if (appModal) {
        appModal.classList.remove('visible');
        setTimeout(() => appModal.remove(), 600);
    }
    
    const flyInModal = document.querySelector('.inline-flyin-modal');
    if (flyInModal) flyInModal.remove();
    
    // Hide bulk edit toolbar if visible
    const bulkEditToolbar = document.querySelector('.bulk-edit-toolbar');
    if (bulkEditToolbar) {
        bulkEditToolbar.style.display = 'none';
    }
    
    // Hide all hotspots
    hideSettingsHotspot();
    hideCampaignEditHotspot();
    hideAppsAutomationHotspot();
    hideShareButtonHotspot();
    
    // Reset canvas position to default
    resetCanvasView();
    
    console.log('Tour closed by user');
}

// BUILD MODE FUNCTIONALITY
let buildState = {
    currentStep: 0,
    completedSteps: [],
    totalSteps: 5,
    userData: {}
};

function initializeGenerationExperience() {
    console.log('Initializing Campaign Generation Experience...');
    
    // Start the generation experience immediately
    setTimeout(() => {
        startGenerationExperience();
    }, 500);
}

function startGenerationExperience() {
    console.log('Starting generation experience...');
    
    // Clear any existing chat content
    const chatContent = document.querySelector('.chat-content');
    if (chatContent) {
        chatContent.innerHTML = '';
    }
    
    // Add user's project goal message
    addUserMessage("The goal of this project is a summer-themed marketing push promoting Whisker & Tails' new limited-edition seasonal flavors like \"Grilled Salmon Picnic\" (for cats) and \"BBQ Chicken Feast\" (for dogs). The campaign encourages pet parents to create fun, memorable summer moments with their pets, showcasing these new flavors as part of the experience.\n\nThe target audience is Adventurous Millennial Pet Parents. Please use the Pet Parents Brand Voice and reference consumer_insights_report to guide your writing.");
    
    // Add Jasper's loading response after a short delay
    setTimeout(() => {
        addJasperLoadingMessage("Generating campaign brief...");
        
        // Start generating the campaign brief
        setTimeout(() => {
            generateCampaignBrief();
        }, 2000);
    }, 1000);
}

function addUserMessage(text) {
    const chatContent = document.querySelector('.chat-content');
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'user-message';
    messageContainer.textContent = text;
    
    chatContent.appendChild(messageContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
}

function addJasperLoadingMessage(text) {
    const chatContent = document.querySelector('.chat-content');
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'jasper-message-container';
    
    messageContainer.innerHTML = `
        <div class="jasper-header">
            <div class="jasper-logo"></div>
            <span class="jasper-name">Jasper</span>
        </div>
        <div class="jasper-message">
            <div class="loading-spinner"></div>
            ${text}
        </div>
    `;
    
    chatContent.appendChild(messageContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
}

function addJasperCompletionMessage(statusText, descriptionText) {
    const chatContent = document.querySelector('.chat-content');
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'jasper-message-container';
    
    messageContainer.innerHTML = `
        <div class="jasper-header">
            <div class="jasper-logo"></div>
            <span class="jasper-name">Jasper</span>
        </div>
        <div class="jasper-completion-message">
            <div class="completion-status">
                <div class="completion-checkmark">✓</div>
                <span class="completion-title">${statusText}</span>
            </div>
            <div class="completion-description">
                ${descriptionText}
            </div>
        </div>
    `;
    
    chatContent.appendChild(messageContainer);
    chatContent.scrollTop = chatContent.scrollHeight;
}

function generateCampaignBrief() {
    console.log('Generating campaign brief...');
    
    // Show the campaign brief card immediately
    const canvasContent = document.querySelector('.canvas-content');
    if (canvasContent) {
        canvasContent.style.opacity = '1';
    }
    
    // Add shimmer effect to campaign brief card
    const campaignBriefCard = document.getElementById('generatedCampaignBrief');
    if (campaignBriefCard) {
        campaignBriefCard.classList.add('generating');
    }
    
    // Define the content sections
    const contentSections = [
        {
            type: 'heading',
            content: 'Overview'
        },
        {
            type: 'paragraph',
            content: 'Whisker & Tails, a premium pet food brand dedicated to providing wholesome, all-natural, human-grade ingredients, is launching the "Summer of Sniffs" campaign to celebrate summer with limited-edition seasonal flavors. The campaign will promote "Grilled Salmon Picnic" for cats and "BBQ Chicken Feast" for dogs. With eco-friendly packaging and vet-approved recipes, this initiative aligns with the brand\'s mission of delivering health-focused, joyful moments for pets and their parents.'
        },
        {
            type: 'paragraph',
            content: 'The campaign\'s core objective is to bring awareness and excitement to the seasonal launch while cultivating deeper engagement with pet owners through memorable summer experiences and user-generated content.'
        },
        {
            type: 'heading',
            content: 'Campaign Concept'
        },
        {
            type: 'paragraph',
            content: '"Summer of Sniffs" is a lighthearted and cheerful marketing campaign designed to inspire pet owners to treat their furry friends to delicious summer-inspired meals and adventures. The concept ties seasonal nostalgia to Whisker & Tails\' limited-edition flavors, driving product trial and fostering shareable moments online. Key visuals and messaging will reflect sunny, playful outdoor activities, tying the joy of summer to a pet\'s happy and healthy lifestyle—all starting with what\'s in their bowl.'
        },
        {
            type: 'heading',
            content: 'Goals'
        },
        {
            type: 'list',
            content: [
                '<strong>Boost Awareness</strong><br>Introduce the limited-edition flavors across key channels, achieving a 25% increase in brand visibility by August 31, 2025.',
                '<strong>Drive Engagement</strong><br>Grow Instagram engagement by 30% by encouraging UGC with hashtags like #SummerOfSniffs.',
                '<strong>Increase Traffic</strong><br>Drive 15% more traffic to the Whisker & Tails website and blog by promoting summer-themed content.',
                '<strong>Grow Product Trials</strong><br>Increase sales of seasonal flavors by 20% during the campaign period.'
            ]
        },
        {
            type: 'heading',
            content: 'Target Audience'
        },
        {
            type: 'paragraph',
            content: 'The campaign targets pet parents who see their pets as family and prioritize high-quality nutrition.'
        },
        {
            type: 'list',
            content: [
                '<strong>Demographics</strong><br>Age 25-44, Income $60K+, Urban and suburban pet owners in the US',
                '<strong>Psychographics</strong><br>Value sustainability, quality ingredients, and their pets\' health. They enjoy documenting their pets\' lives and sharing moments on social media.',
                '<strong>Motivations & Needs</strong><br>Providing their pets with the best care and nutrition. Creating memorable bonding moments. Finding trustworthy products that align with personal ethics (sustainability, vet approval).',
                '<strong>Pain Points</strong><br>Difficulty finding tasty, nutrient-rich pet food. Concerns about artificial ingredients and packaging waste.'
            ]
        },
        {
            type: 'heading',
            content: 'Key Messaging'
        },
        {
            type: 'list',
            content: [
                '<strong>Primary Message</strong><br>Celebrate summer with wholesome, limited-edition meals for your furry friend. Treat them to flavors as vibrant as the season!',
                '<strong>Secondary Message</strong><br>Vet-approved, health-focused recipes made from human-grade ingredients for shiny coats, good digestion, and boundless energy.',
                '<strong>Eco-Friendly Focus</strong><br>You can feel good about every purchase—made with sustainability in mind, from the food to the packaging.'
            ]
        },
        {
            type: 'heading',
            content: 'Channels and Tactics'
        },
        {
            type: 'paragraph',
            content: '<strong>Social Media</strong><br>Instagram-focused UGC contest (#SummerOfSniffs): Share photos or videos of your pet enjoying summer for a chance to win a supply of Whisker & Tails treats. Carousel posts highlighting the summer flavors and their benefits. Summer-themed graphics, such as checklists and playful imagery of pets enjoying outdoor adventures.'
        },
        {
            type: 'paragraph',
            content: '<strong>Website & Blog</strong><br>Blog post featuring "5 Fun Ways to Treat Your Pet This Summer (Starting with What\'s in Their Bowl)" to drive SEO traffic and keep readers engaged. Dedicated landing page for the "Summer of Sniffs" campaign to promote flavors and collect email leads.'
        },
        {
            type: 'paragraph',
            content: '<strong>Email Marketing</strong><br>Announce the seasonal launch with an engaging campaign email linked to the product page.'
        },
        {
            type: 'heading',
            content: 'Timeline'
        },
        {
            type: 'list',
            content: [
                '<strong>Kickoff: June 15, 2025</strong><br>Finalize campaign creative and launch teaser social posts.',
                '<strong>Launch: June 20, 2025</strong><br>Introduce flavors with posts, blog content, and paid ads.',
                '<strong>Mid-Campaign: July 10, 2025</strong><br>Push UGC contest and engage with user content.',
                '<strong>Wrap-Up: August 31, 2025</strong><br>Conclude with a summary post highlighting favorite user stories and campaign impact.'
            ]
        },
        {
            type: 'heading',
            content: 'Deliverables'
        },
        {
            type: 'list',
            content: [
                'Campaign brief (this document)',
                'Blog post on summer pet treats and activities',
                'Three Instagram post variants',
                'Email campaign copy and design'
            ]
        },
        {
            type: 'heading',
            content: 'Measurement and Reporting'
        },
        {
            type: 'paragraph',
            content: '<strong>KPIs:</strong> Instagram engagement rate, hashtag performance (#SummerOfSniffs), Website traffic from campaign landing page, Seasonal product sales uplift, UGC submissions'
        },
        {
            type: 'paragraph',
            content: '<strong>Reporting Schedule:</strong> Weekly campaign updates, final results evaluated by September 10, 2025.'
        },
        {
            type: 'paragraph',
            content: 'By connecting seasonal fun with wholesome, high-quality meals, Whisker & Tails\' "Summer of Sniffs" campaign will elevate the brand and turn summer into a time of joy for pets and their humans.'
        }
    ];
    
    // Start generating content
    generateContentSections(contentSections);
}

function generateContentSections(sections) {
    const briefContent = document.getElementById('briefContent');
    let currentIndex = 0;
    
    function addNextSection() {
        if (currentIndex >= sections.length) {
            // All sections added, show completion message
            setTimeout(() => {
                // Remove shimmer effect from campaign brief card
                const campaignBriefCard = document.getElementById('generatedCampaignBrief');
                if (campaignBriefCard) {
                    campaignBriefCard.classList.remove('generating');
                }
                
                // Remove the loading message and add completion message
                const chatContent = document.querySelector('.chat-content');
                const lastMessage = chatContent.lastElementChild;
                if (lastMessage && lastMessage.classList.contains('jasper-message-container')) {
                    lastMessage.remove();
                }
                
                addJasperCompletionMessage(
                    "Generating campaign brief",
                    `I've created a comprehensive strategy for your "Summer of Sniffs" campaign, including target audience analysis, key messaging, channels and timeline.<br><br>Next steps you might consider:<br>• Create multiple Instagram posts with targeted messaging that aligns with your campaign strategy<br>• Create a blog post using Jasper App`
                );
                
                // Show the settings hotspot after a longer delay
                setTimeout(() => {
                    showSettingsHotspot();
                }, 2500);
            }, 300);
            return;
        }
        
        const section = sections[currentIndex];
        const element = createContentElement(section);
        
        // Add element to content
        briefContent.appendChild(element);
        
        currentIndex++;
        
        // Add delay before next section based on type
        const delay = section.type === 'heading' ? 200 : 
                     section.type === 'paragraph' ? 400 : 
                     650; // list
        
        setTimeout(addNextSection, delay);
    }
    
    // Start the process
    addNextSection();
}

function createContentElement(section) {
    let element;
    
    if (section.type === 'heading') {
        element = document.createElement('h4');
        element.textContent = section.content;
    } else if (section.type === 'paragraph') {
        element = document.createElement('p');
        element.innerHTML = section.content;
    } else if (section.type === 'list') {
        element = document.createElement('ul');
        section.content.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item;
            element.appendChild(li);
        });
    }
    
        return element;
}

function showSettingsHotspot() {
    console.log('Showing settings tooltip...');
    
    const tooltipContainer = document.getElementById('settingsHotspot');
    if (tooltipContainer) {
        tooltipContainer.style.display = 'block';
        // Set flag so we know to show campaign edit hotspot later
        shouldShowCampaignEditAfterModalClose = true;
    }
}

function hideSettingsHotspot() {
    console.log('Hiding settings tooltip...');
    
    const tooltipContainer = document.getElementById('settingsHotspot');
    if (tooltipContainer) {
        tooltipContainer.style.display = 'none';
        
        // Only show campaign edit hotspot if user clicked "Got it" (flag still true)
        // If they opened project settings, the flag will be false
        if (shouldShowCampaignEditAfterModalClose) {
            shouldShowCampaignEditAfterModalClose = false; // Reset flag
            setTimeout(() => {
                showCampaignEditHotspot();
            }, 500);
        }
    }
}



function showCampaignEditHotspot() {
    console.log('Showing campaign edit hotspot...');
    
    const hotspot = document.getElementById('campaignEditHotspot');
    const campaignBrief = document.getElementById('generatedCampaignBrief');
    const canvasViewport = document.querySelector('.canvas-viewport');
    
    if (hotspot && campaignBrief && canvasViewport) {
        // Attach hotspot to canvas viewport so it moves with canvas
        canvasViewport.appendChild(hotspot);
        
        // Position next to the campaign brief title in the card header
        const briefRect = campaignBrief.getBoundingClientRect();
        const viewportRect = canvasViewport.getBoundingClientRect();
        
        // Find the card title in the header
        const cardTitle = campaignBrief.querySelector('.card-title');
        const titleRect = cardTitle ? cardTitle.getBoundingClientRect() : briefRect;
        
        hotspot.style.position = 'absolute';
        hotspot.style.top = (titleRect.top - viewportRect.top + titleRect.height / 2 - 7) + 'px'; // Center vertically with title
        hotspot.style.left = (titleRect.right - viewportRect.left + 8) + 'px'; // Right next to title
        hotspot.style.display = 'block';
        
        // Add canvas movement tracking
        setupCampaignEditHotspotTracking(hotspot, campaignBrief);
    }
}



function setupCampaignEditHotspotTracking(hotspot, campaignBrief) {
    const updatePosition = () => {
        if (hotspot.style.display === 'none') return;
        
        const viewportRect = document.querySelector('.canvas-viewport').getBoundingClientRect();
        
        // Find the card title in the header
        const cardTitle = campaignBrief.querySelector('.card-title');
        const titleRect = cardTitle ? cardTitle.getBoundingClientRect() : campaignBrief.getBoundingClientRect();
        
        // Update hotspot position next to campaign brief title
        hotspot.style.top = (titleRect.top - viewportRect.top + titleRect.height / 2 - 7) + 'px'; // Center vertically with title
        hotspot.style.left = (titleRect.right - viewportRect.left + 8) + 'px'; // Right next to title
    };

    // Track canvas movements
    const canvasViewport = document.querySelector('.canvas-viewport');
    
    // Store the update function for cleanup
    hotspot._updatePosition = updatePosition;
    
    // Listen for canvas transformations
    const observer = new MutationObserver(updatePosition);
    observer.observe(canvasViewport, {
        attributes: true,
        attributeFilter: ['style']
    });
    
    // Store observer for cleanup
    hotspot._observer = observer;
}

function hideCampaignEditHotspot() {
    console.log('Hiding campaign edit hotspot...');
    
    const hotspot = document.getElementById('campaignEditHotspot');
    if (hotspot) {
        hotspot.style.display = 'none';
        
        // Clean up tracking
        if (hotspot._observer) {
            hotspot._observer.disconnect();
            delete hotspot._observer;
        }
        if (hotspot._updatePosition) {
            delete hotspot._updatePosition;
        }
        
        // Move back to document body
        document.body.appendChild(hotspot);
    }
}

function selectCampaignBrief() {
    console.log('Selecting campaign brief...');
    
    const campaignBrief = document.getElementById('generatedCampaignBrief');
    const hotspot = document.getElementById('campaignEditHotspot');
    
    // Hide the hotspot
    if (hotspot) {
        hotspot.style.display = 'none';
        
        // Clean up tracking
        if (hotspot._observer) {
            hotspot._observer.disconnect();
            delete hotspot._observer;
        }
        if (hotspot._updatePosition) {
            delete hotspot._updatePosition;
        }
        
        // Move back to document body
        document.body.appendChild(hotspot);
    }
    
    // Add selected class to campaign brief
    if (campaignBrief) {
        campaignBrief.classList.add('selected');
    }
    
    // Add campaign brief pill to chat input
    addCampaignBriefPillToChat();
}

// Instagram Posts Generation
function generateInstagramPosts() {
    console.log('Starting Instagram posts generation...');
    
    // Create Instagram posts section
    const canvasContent = document.getElementById('canvasContent');
    if (!canvasContent) return;
    
    // Create new section for Instagram posts
    const instagramSection = document.createElement('section');
    instagramSection.className = 'content-section social-media';
    instagramSection.innerHTML = `
        <div class="section-container">
            <div class="asset-cards-row">
                <div class="asset-card instagram-post generating" id="instagramPost1">
                    <div class="card-header">
                        <div class="card-header-left">
                            <button class="icon-btn">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="12" height="12" rx="2" fill="#9CA3AF"/>
                                </svg>
                            </button>
                            <span class="card-title">Instagram Post</span>
                        </div>
                        <div class="card-header-right">
                            <button class="icon-btn">
                                <svg viewBox="0 0 13 13" width="14" height="14">
                                    <path d="M7.41667 5.08333L11.5 1M11.5 1H8M11.5 1V4.5M5.08333 7.41667L1 11.5M1 11.5H4.5M1 11.5L1 8" stroke="#374151" stroke-width="1.25" stroke-linecap="square"/>
                                </svg>
                            </button>
                            <button class="icon-btn">
                                <svg viewBox="0 0 3 12" width="14" height="14">
                                    <circle cx="1.58333" cy="1.58333" r="0.58333" fill="#374151"/>
                                    <circle cx="1.58333" cy="5.66667" r="0.58333" fill="#374151"/>
                                    <circle cx="1.58333" cy="9.75" r="0.58333" fill="#374151"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="content-text" id="instagramContent1">
                            <!-- Content will be generated dynamically -->
                        </div>
                    </div>
                </div>
                
                <div class="asset-card instagram-post generating" id="instagramPost2">
                    <div class="card-header">
                        <div class="card-header-left">
                            <button class="icon-btn">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="12" height="12" rx="2" fill="#9CA3AF"/>
                                </svg>
                            </button>
                            <span class="card-title">Instagram Post</span>
                        </div>
                        <div class="card-header-right">
                            <button class="icon-btn">
                                <svg viewBox="0 0 13 13" width="14" height="14">
                                    <path d="M7.41667 5.08333L11.5 1M11.5 1H8M11.5 1V4.5M5.08333 7.41667L1 11.5M1 11.5H4.5M1 11.5L1 8" stroke="#374151" stroke-width="1.25" stroke-linecap="square"/>
                                </svg>
                            </button>
                            <button class="icon-btn">
                                <svg viewBox="0 0 3 12" width="14" height="14">
                                    <circle cx="1.58333" cy="1.58333" r="0.58333" fill="#374151"/>
                                    <circle cx="1.58333" cy="5.66667" r="0.58333" fill="#374151"/>
                                    <circle cx="1.58333" cy="9.75" r="0.58333" fill="#374151"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="content-text" id="instagramContent2">
                            <!-- Content will be generated dynamically -->
                        </div>
                    </div>
                </div>
                
                <div class="asset-card instagram-post generating" id="instagramPost3">
                    <div class="card-header">
                        <div class="card-header-left">
                            <button class="icon-btn">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="12" height="12" rx="2" fill="#9CA3AF"/>
                                </svg>
                            </button>
                            <span class="card-title">Instagram Post</span>
                        </div>
                        <div class="card-header-right">
                            <button class="icon-btn">
                                <svg viewBox="0 0 13 13" width="14" height="14">
                                    <path d="M7.41667 5.08333L11.5 1M11.5 1H8M11.5 1V4.5M5.08333 7.41667L1 11.5M1 11.5H4.5M1 11.5L1 8" stroke="#374151" stroke-width="1.25" stroke-linecap="square"/>
                                </svg>
                            </button>
                            <button class="icon-btn">
                                <svg viewBox="0 0 3 12" width="14" height="14">
                                    <circle cx="1.58333" cy="1.58333" r="0.58333" fill="#374151"/>
                                    <circle cx="1.58333" cy="5.66667" r="0.58333" fill="#374151"/>
                                    <circle cx="1.58333" cy="9.75" r="0.58333" fill="#374151"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="content-text" id="instagramContent3">
                            <!-- Content will be generated dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to canvas content
    canvasContent.appendChild(instagramSection);
    
    // Pan canvas to show Instagram posts
    setTimeout(() => {
        panToInstagramPosts();
    }, 500);
    
    // Generate content for each Instagram post
    const instagramPosts = [
        `🎉🐾 Summer just got tastier for your furry friends!  
Introducing Whisker & Tails' limited-edition Summer of Sniffs flavors! 🌞  
🐱 Grilled Salmon Picnic for cats  
🐶 BBQ Chicken Feast for dogs  
Made with all-natural, human-grade ingredients and served up in eco-friendly packaging, these recipes are vet-approved to bring health and joy to every meal. 🌿❤️  
✨ Share the love! Try the new flavors and tag us with your pet's reaction using #SummerOfSniffs — your fur-baby might just steal the show! 🐕🐈  
📸 What are you waiting for? Delicious memories are just a sniff away!  
#WhiskerAndTails #PetJoy #LimitedEdition #TreatYourPets #EcoFriendly`,
        
        `🌍🐾 Care for your pet, care for the planet!  
At Whisker & Tails, we're not just serving up delicious, pet-approved meals like our Summer of Sniffs flavors — Grilled Salmon Picnic for cats and BBQ Chicken Feast for dogs 🐱🐶 — but we're also serving up a promise to the environment.  
Our eco-friendly packaging is made with sustainable materials, so you can feel good knowing that every meal for your furry friend helps protect the planet we all love. 🌿💚  
✨ Join us! Share your eco-friendly pet care tips using #EcoFriendlyPets and inspire others to make a positive impact for both their pets and the Earth.  
Because creating a better future starts with the choices we make today — for us, for them, and for generations to come. 🐾💡🌎  
#WhiskerAndTails #SustainableLiving #PetCareWithPurpose #SummerOfSniffs #EcoFriendly`,
        
        `🌎🐾 Small choices make a big impact!  
At Whisker & Tails, we believe in pampering your pets while protecting the planet. That's why our Summer of Sniffs limited-edition meals — Grilled Salmon Picnic for cats and BBQ Chicken Feast for dogs 🐱🐶 — come in eco-friendly, sustainable packaging.  
Every purchase helps reduce waste and ensures a healthier future for our furry friends and their humans. 🌿💚 Together, we can create a world that's as kind to the Earth as it is to your pets!  
✨ Your voice matters! Share your thoughts on sustainability and how you're making greener choices for your pets by tagging us with #WhiskerAndTails.  
Because a brighter future starts with all of us. 🐾🌞  
#WhiskerAndTails #SustainableChoices #PetCareForPlanet #EcoFriendlyPets #SummerOfSniffs`
    ];
    
    // Generate each Instagram post with delay
    instagramPosts.forEach((content, index) => {
        setTimeout(() => {
            generateInstagramPostContent(index + 1, content);
        }, (index + 1) * 1000);
    });
}

function generateInstagramPostContent(postNumber, content) {
    const contentDiv = document.getElementById(`instagramContent${postNumber}`);
    const postCard = document.getElementById(`instagramPost${postNumber}`);
    
    if (!contentDiv || !postCard) return;
    
    // Split content into paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    let currentIndex = 0;
    
    function addNextParagraph() {
        if (currentIndex >= paragraphs.length) {
            // Remove generating class and shimmer effect
            postCard.classList.remove('generating');
            
            // Show completion message for last post
            if (postNumber === 3) {
                setTimeout(() => {
                    const lastMessage = document.querySelector('.jasper-message-container:last-child');
                    if (lastMessage && lastMessage.classList.contains('jasper-message-container')) {
                        lastMessage.remove();
                    }
                    
                    addJasperCompletionMessage(
                        "Instagram posts created",
                        "I've created 3 instagram posts with targeted mesaging that aligns with your campaign strategy. Each post highlights different aspects of your Summer of Sniffs campaign.<br><br>Next steps you might consider:<br>• Create an SEO optimized blog post using Jasper App"
                    );
                    
                    // Show the apps automation hotspot after Instagram posts are completed
                    setTimeout(() => {
                        showAppsAutomationHotspot();
                    }, 1000);
                }, 300);
            }
            return;
        }
        
        const paragraph = paragraphs[currentIndex];
        const element = document.createElement('p');
        element.textContent = paragraph;
        element.style.fontSize = '14px';
        element.style.lineHeight = '1.5';
        element.style.marginBottom = '12px';
        element.style.color = '#374151';
        
        contentDiv.appendChild(element);
        currentIndex++;
        
        // Add delay before next paragraph
        setTimeout(addNextParagraph, 300);
    }
    
    // Start the process
    addNextParagraph();
}

function panToInstagramPosts() {
    const viewport = document.querySelector('.canvas-viewport');
    if (!viewport) return;
    
    // Get current transform values
    const currentTransform = viewport.style.transform || 'translate(400px, 200px) scale(1.2)';
    const transformMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
    
    let currentY = transformMatch ? parseFloat(transformMatch[2]) || 200 : 200;
    let currentScale = scaleMatch ? parseFloat(scaleMatch[1]) || 1.2 : 1.2;
    
    // Pan right to show Instagram posts (move left in transform coordinates)
    const newX = -200; // Move further left to show Instagram posts next to campaign brief
    
    // Apply new transform
    viewport.style.transform = `translate(${newX}px, ${currentY}px) scale(${currentScale})`;
    
    console.log('Panned canvas to show Instagram posts');
}

// Apps Automation Hotspot Functions
function showAppsAutomationHotspot() {
    console.log('Showing apps automation hotspot...');
    
    const hotspot = document.getElementById('appsAutomationHotspot');
    const cubeBtn = document.querySelector('.action-bar .cube-btn');
    
    console.log('Hotspot element:', hotspot);
    console.log('Cube button element:', cubeBtn);
    
    if (!hotspot || !cubeBtn) {
        console.log('Hotspot or cube button not found');
        console.log('Available action buttons:', document.querySelectorAll('.action-bar .action-btn'));
        return;
    }
    
    // Position the hotspot over the cube button
    const cubeBtnRect = cubeBtn.getBoundingClientRect();
    console.log('Cube button rect:', cubeBtnRect);
    
    const centerX = cubeBtnRect.left + cubeBtnRect.width / 2;
    const centerY = cubeBtnRect.top + cubeBtnRect.height / 2;
    
    console.log('Positioning hotspot at:', centerX, centerY);
    
    hotspot.style.left = centerX + 'px';
    hotspot.style.top = centerY + 'px';
    hotspot.style.transform = 'translate(-50%, -50%)';
    
    // Show the hotspot
    hotspot.style.display = 'block';
    console.log('Hotspot should now be visible');
    
    // Set up tracking for canvas movement
    setupAppsAutomationHotspotTracking(hotspot, cubeBtn);
}

function setupAppsAutomationHotspotTracking(hotspot, cubeBtn) {
    const updatePosition = () => {
        const cubeBtnRect = cubeBtn.getBoundingClientRect();
        const centerX = cubeBtnRect.left + cubeBtnRect.width / 2;
        const centerY = cubeBtnRect.top + cubeBtnRect.height / 2;
        
        hotspot.style.left = centerX + 'px';
        hotspot.style.top = centerY + 'px';
        hotspot.style.transform = 'translate(-50%, -50%)';
    };
    
    // Store the update function
    hotspot._updatePosition = updatePosition;
    
    // Set up mutation observer for canvas changes
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
    });
    
    hotspot._observer = observer;
}

function hideAppsAutomationHotspot() {
    console.log('Hiding apps automation hotspot...');
    
    const hotspot = document.getElementById('appsAutomationHotspot');
    if (hotspot) {
        hotspot.style.display = 'none';
        
        // Clean up tracking
        if (hotspot._observer) {
            hotspot._observer.disconnect();
            delete hotspot._observer;
        }
        if (hotspot._updatePosition) {
            delete hotspot._updatePosition;
        }
    }
}

// Share Button Hotspot Functions
function showShareButtonHotspot() {
    console.log('Showing share button hotspot...');
    
    const hotspot = document.getElementById('shareButtonHotspot');
    const shareBtn = document.querySelector('.header-right .share-btn');
    
    console.log('Share hotspot element:', hotspot);
    console.log('Share button element:', shareBtn);
    
    if (!hotspot || !shareBtn) {
        console.log('Share hotspot or share button not found');
        return;
    }
    
    // Position the hotspot over the share button
    const shareBtnRect = shareBtn.getBoundingClientRect();
    console.log('Share button rect:', shareBtnRect);
    
    const centerX = shareBtnRect.left + shareBtnRect.width / 2;
    const centerY = shareBtnRect.top + shareBtnRect.height / 2;
    
    console.log('Positioning share hotspot at:', centerX, centerY);
    
    hotspot.style.left = centerX + 'px';
    hotspot.style.top = centerY + 'px';
    hotspot.style.transform = 'translate(-50%, -50%)';
    
    // Show the hotspot
    hotspot.style.display = 'block';
    console.log('Share hotspot should now be visible');
    
    // Set up tracking for canvas movement
    setupShareButtonHotspotTracking(hotspot, shareBtn);
}

function setupShareButtonHotspotTracking(hotspot, shareBtn) {
    const updatePosition = () => {
        const shareBtnRect = shareBtn.getBoundingClientRect();
        const centerX = shareBtnRect.left + shareBtnRect.width / 2;
        const centerY = shareBtnRect.top + shareBtnRect.height / 2;
        
        hotspot.style.left = centerX + 'px';
        hotspot.style.top = centerY + 'px';
        hotspot.style.transform = 'translate(-50%, -50%)';
    };
    
    // Store the update function
    hotspot._updatePosition = updatePosition;
    
    // Set up mutation observer for canvas changes
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
    });
    
    hotspot._observer = observer;
}

function hideShareButtonHotspot() {
    console.log('Hiding share button hotspot...');
    
    const hotspot = document.getElementById('shareButtonHotspot');
    if (hotspot) {
        hotspot.style.display = 'none';
        
        // Clean up tracking
        if (hotspot._observer) {
            hotspot._observer.disconnect();
            delete hotspot._observer;
        }
        if (hotspot._updatePosition) {
            delete hotspot._updatePosition;
        }
    }
}

function goToShareHotspot() {
    console.log('Going from apps hotspot to share hotspot...');
    
    // Hide the apps automation hotspot
    hideAppsAutomationHotspot();
    
    // Show the share button hotspot after a brief delay
    setTimeout(() => {
        showShareButtonHotspot();
    }, 300);
}

// Test function for debugging - call this in console
function testAppsHotspot() {
    console.log('Testing apps automation hotspot...');
    showAppsAutomationHotspot();
}

function testShareHotspot() {
    console.log('Testing share button hotspot...');
    showShareButtonHotspot();
}

// Make test function globally available
window.testAppsHotspot = testAppsHotspot;
window.testShareHotspot = testShareHotspot;
window.showAppsAutomationHotspot = showAppsAutomationHotspot;
window.hideAppsAutomationHotspot = hideAppsAutomationHotspot;
window.showShareButtonHotspot = showShareButtonHotspot;
window.hideShareButtonHotspot = hideShareButtonHotspot;
window.goToShareHotspot = goToShareHotspot;

// Navigation functions
function goBackToWelcome() {
    window.location.href = 'index.html';
}

// Make navigation function globally available
window.goBackToWelcome = goBackToWelcome;





