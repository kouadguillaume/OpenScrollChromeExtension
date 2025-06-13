// Enhanced DeepSeek Scraper
// This improved version features better error handling, performance optimizations,
// advanced content parsing, and additional functionality

/**
 * Configuration options with sensible defaults
 */
const CONFIG = {
  selectors: {
    conversationTitle: '.d8ed659a, .conversation-title, h1',
    messageContainers: '.f72b0bab, .message-container, [class*="chat"], [class*="message"]',
    userContent: '.fbb737a4, .fa81, .user-message-content',
    assistantContent: '.ds-markdown, [class*="ds-markdown--block"], .assistant-message-content',
  },
  debug: true, // Enabled for troubleshooting
  includeMetadata: true,
  formatOptions: {
    preserveWhitespace: true,
    normalizeNewlines: true,
    trimEmptyBlocks: true
  },
  dynamicLoadDelay: 1000 // Delay in ms to wait for dynamic content
};

/**
 * Utility for logging based on debug configuration
 */
const logger = {
  debug: (...args) => CONFIG.debug && console.debug('[DeepSeek Scraper]', ...args),
  info: (...args) => console.info('[DeepSeek Scraper]', ...args),
  warn: (...args) => console.warn('[DeepSeek Scraper]', ...args),
  error: (...args) => console.error('[DeepSeek Scraper]', ...args)
};

/**
 * Enhanced LaTeX converter with more comprehensive patterns
 * @param {string} content - Content containing LaTeX
 * @returns {string} - Processed content
 */
function convertLatex(content) {
  if (!content || typeof content !== 'string') return '';
  
  try {
    let processed = content.replace(/\\\$\s*(.*?)\s*\\\$/g, (_, eq) => `$${eq}$`);
    processed = processed.replace(/\\\$\\\$\s*([\s\S]*?)\s*\\\$\\\$/gs, (_, eq) => `$$${eq}$$`);
    processed = processed.replace(/\\(["`'])/g, '$1');
    const preservedCommands = ['\\begin', '\\end', '\\frac', '\\sum', '\\int', '\\mathbf'];
    preservedCommands.forEach(cmd => {
      const escapedCmd = cmd.replace(/\\/g, '\\\\');
      processed = processed.replace(new RegExp(escapedCmd, 'g'), cmd);
    });
    return processed;
  } catch (error) {
    logger.error('Error converting LaTeX:', error);
    return content;
  }
}

/**
 * Advanced content parser that handles nested code blocks and special syntax
 * @param {string} content - Raw content to parse
 * @returns {Array} - Array of content blocks with type and data
 */
function parseContent(content) {
  if (!content || typeof content !== 'string') return [];
  
  try {
    const CODE_BLOCK_REGEX = /```([^\s]*)\n?([\s\S]*?)```/g;
    const INLINE_CODE_REGEX = /`([^`]+)`/g;
    const MATH_BLOCK_REGEX = /\$\$([\s\S]*?)\$\$/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = CODE_BLOCK_REGEX.exec(content)) !== null) {
      const [fullMatch, lang, code] = match;
      const offset = match.index;
      
      if (offset > lastIndex) {
        const textPart = content.slice(lastIndex, offset);
        if (textPart.trim()) {
          parts.push({ 
            type: 'text', 
            data: normalizeText(textPart),
            metadata: { charCount: textPart.length }
          });
        }
      }
      
      const language = lang.trim() || 'plaintext';
      const cleanedCode = code.trim();
      parts.push({
        type: 'code',
        language,
        data: normalizeText(cleanedCode, false),
        metadata: {
          charCount: cleanedCode.length,
          lineCount: cleanedCode.split('\n').length
        }
      });
      lastIndex = offset + fullMatch.length;
    }
    
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      if (remainingText.trim()) {
        let currentIndex = 0;
        const textParts = [];
        const combinedRegex = new RegExp(`${INLINE_CODE_REGEX.source}|${MATH_BLOCK_REGEX.source}`, 'g');
        
        while ((match = combinedRegex.exec(remainingText)) !== null) {
          const [fullMatch, codeContent, mathContent] = match;
          const matchOffset = match.index;
          
          if (matchOffset > currentIndex) {
            const textBefore = remainingText.slice(currentIndex, matchOffset);
            if (textBefore.trim()) {
              textParts.push({ type: 'text', data: normalizeText(textBefore) });
            }
          }
          
          if (codeContent) {
            textParts.push({ type: 'inlineCode', data: codeContent });
          } else if (mathContent) {
            textParts.push({ type: 'math', data: mathContent });
          }
          
          currentIndex = matchOffset + fullMatch.length;
        }
        
        if (currentIndex < remainingText.length) {
          const textAfter = remainingText.slice(currentIndex);
          if (textAfter.trim()) {
            textParts.push({ type: 'text', data: normalizeText(textAfter) });
          }
        }
        
        if (textParts.length > 0) {
          parts.push(...textParts);
        } else {
          parts.push({ 
            type: 'text', 
            data: normalizeText(remainingText),
            metadata: { charCount: remainingText.length }
          });
        }
      }
    }
    
    return parts;
  } catch (error) {
    logger.error('Error parsing content:', error);
    return [{ type: 'text', data: normalizeText(content) }];
  }
}

/**
 * Normalizes text for consistent output
 * @param {string} text - Text to normalize
 * @param {boolean} processLatex - Whether to process LaTeX in the text
 * @returns {string} - Normalized text
 */
function normalizeText(text, processLatex = true) {
  if (!text) return '';
  
  let normalized = text.replace(/\\n/g, '\n');
  if (CONFIG.formatOptions.normalizeNewlines) {
    normalized = normalized.replace(/\r\n/g, '\n');
  }
  if (processLatex) {
    normalized = convertLatex(normalized);
  }
  if (!CONFIG.formatOptions.preserveWhitespace) {
    normalized = normalized.trim();
  }
  return normalized;
}

/**
 * Enhanced DOM to Markdown converter with better element handling
 * @param {Element} element - DOM element to convert
 * @returns {string} - Markdown representation
 */
function domToMarkdown(element) {
  if (!element) return '';
  
  try {
    let markdown = '';
    const processNode = (node, depth = 0) => {
      if (!node) return '';
      
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        let childContent = '';
        if (tagName !== 'pre' && tagName !== 'code') {
          for (const child of node.childNodes) {
            childContent += processNode(child, depth + 1);
          }
        }
        
        switch (tagName) {
          case 'div':
          case 'section':
            return childContent + (depth === 0 ? '\n\n' : '');
          case 'h1': return `# ${childContent.trim()}\n\n`;
          case 'h2': return `## ${childContent.trim()}\n\n`;
          case 'h3': return `### ${childContent.trim()}\n\n`;
          case 'h4': return `#### ${childContent.trim()}\n\n`;
          case 'h5': return `##### ${childContent.trim()}\n\n`;
          case 'h6': return `###### ${childContent.trim()}\n\n`;
          case 'p': return `${childContent.trim()}\n\n`;
          case 'a':
            const href = node.getAttribute('href');
            return href ? `[${childContent.trim()}](${href})` : childContent;
          case 'strong':
          case 'b':
            return `**${childContent.trim()}**`;
          case 'em':
          case 'i':
            return `*${childContent.trim()}*`;
          case 'code':
            if (node.parentElement?.tagName.toLowerCase() !== 'pre') {
              return `\`${node.textContent}\``;
            }
            return node.textContent;
          case 'pre':
            const codeElement = node.querySelector('code');
            const codeContent = (codeElement || node).textContent.trim();
            const langClass = (codeElement || node).className;
            const lang = langClass?.match(/language-([a-zA-Z0-9]+)/)?.[1] || '';
            return `\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`;
          case 'blockquote':
            return childContent.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
          case 'ul':
            let ulResult = '\n';
            node.querySelectorAll(':scope > li').forEach(li => {
              ulResult += `- ${processNode(li).trim()}\n`;
            });
            return ulResult + '\n';
          case 'ol':
            let olResult = '\n';
            let counter = 1;
            node.querySelectorAll(':scope > li').forEach(li => {
              olResult += `${counter++}. ${processNode(li).trim()}\n`;
            });
            return olResult + '\n';
          case 'li':
            return childContent;
          case 'table':
            let tableResult = '\n';
            const headerRow = node.querySelector('thead tr') || node.querySelector('tr:first-child');
            if (headerRow) {
              const headerCells = Array.from(headerRow.querySelectorAll('th, td'))
                .map(cell => processNode(cell).trim() || ' ');
              tableResult += `| ${headerCells.join(' | ')} |\n`;
              tableResult += `| ${headerCells.map(() => '---').join(' | ')} |\n`;
              const skipFirstRow = !node.querySelector('thead') && node.querySelector('tr:first-child');
              const bodyRows = skipFirstRow 
                ? Array.from(node.querySelectorAll('tr')).slice(1)
                : Array.from(node.querySelectorAll('tbody tr'));
              bodyRows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td'))
                  .map(cell => processNode(cell).trim() || ' ');
                tableResult += `| ${cells.join(' | ')} |\n`;
              });
            }
            return tableResult + '\n';
          case 'br':
            return '\n';
          case 'hr':
            return '\n---\n\n';
          case 'img':
            const src = node.getAttribute('src') || '';
            const alt = node.getAttribute('alt') || '';
            return `![${alt}](${src})`;
          case 'span':
            if (node.classList.contains('katex') || node.classList.contains('math')) {
              return convertLatex(node.textContent.trim());
            }
            return childContent;
          default:
            return childContent;
        }
      }
      return '';
    };
    
    markdown = processNode(element);
    if (CONFIG.formatOptions.trimEmptyBlocks) {
      markdown = markdown.replace(/\n{3,}/g, '\n\n');
    }
    return markdown.trim();
  } catch (error) {
    logger.error('Error converting DOM to markdown:', error);
    return element.textContent || '';
  }
}

/**
 * Generates a cryptographically stronger conversation ID
 * @returns {string} Unique conversation ID
 */
function generateConversationId() {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return 'deepseek_' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substr(0, 16);
}

/**
 * Extracts metadata from the page for richer context
 * @returns {Object} Metadata object
 */
function extractMetadata() {
  try {
    const metadata = {
      title: document.title,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
    const modelElement = document.querySelector('[class*="model-name"], [data-model]');
    if (modelElement) {
      metadata.model = modelElement.textContent.trim() || modelElement.getAttribute('data-model');
    }
    return metadata;
  } catch (error) {
    logger.warn('Error extracting metadata:', error);
    return { timestamp: new Date().toISOString() };
  }
}

/**
 * Detects the current theme (light/dark) from the page
 * @returns {string} Theme name
 */
function detectTheme() {
  try {
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains('dark')) return 'dark';
    if (htmlEl.classList.contains('light')) return 'light';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    const bgColor = window.getComputedStyle(document.body).backgroundColor;
    if (bgColor) {
      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        return brightness < 128 ? 'dark' : 'light';
      }
    }
    return 'unknown';
  } catch (error) {
    logger.warn('Error detecting theme:', error);
    return 'unknown';
  }
}

/**
 * Safely finds elements in the DOM with fallbacks
 * @param {string} selectors - Comma-separated list of selectors to try
 * @param {Element} context - Element to search within
 * @returns {NodeList|Array} Matching elements
 */
function safeQuerySelectorAll(selectors, context = document) {
  try {
    const selectorList = selectors.split(',').map(s => s.trim());
    for (const selector of selectorList) {
      try {
        const elements = context.querySelectorAll(selector);
        if (elements && elements.length > 0) {
          return elements;
        }
      } catch (e) {
        logger.debug(`Selector "${selector}" failed:`, e);
      }
    }
    logger.warn(`No elements found for selectors: ${selectors}`);
    return [];
  } catch (error) {
    logger.error('Error in safeQuerySelectorAll:', error);
    return [];
  }
}

/**
 * Exports the conversation to a JSON file for download
 * @param {Object} conversation - The conversation data
 */
function exportConversation(conversation) {
  try {
    const json = JSON.stringify(conversation, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.conversation_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    logger.error('Error exporting conversation:', error);
    return false;
  }
}

/**
 * Formats the conversation as Markdown
 * @param {Object} conversation - The conversation data
 * @returns {string} Markdown representation
 */
function formatAsMarkdown(conversation) {
  try {
    let markdown = `# ${conversation.conversation_title}\n\n`;
    if (conversation.metadata) {
      markdown += `*Date: ${new Date(conversation.metadata.timestamp).toLocaleString()}*\n\n`;
      if (conversation.metadata.model) {
        markdown += `*Model: ${conversation.metadata.model}*\n\n`;
      }
    }
    markdown += '---\n\n';
    conversation.messages.forEach((message, index) => {
      const role = message.role.charAt(0).toUpperCase() + message.role.slice(1);
      markdown += `## ${role}\n\n`;
      message.content.forEach(block => {
        if (block.type === 'text') {
          markdown += `${block.data}\n\n`;
        } else if (block.type === 'code') {
          markdown += `\`\`\`${block.language}\n${block.data}\n\`\`\`\n\n`;
        } else if (block.type === 'inlineCode') {
          markdown += `\`${block.data}\``;
        } else if (block.type === 'math') {
          markdown += `$$${block.data}$$\n\n`;
        }
      });
      if (index < conversation.messages.length - 1) {
        markdown += '---\n\n';
      }
    });
    return markdown;
  } catch (error) {
    logger.error('Error formatting as markdown:', error);
    return '';
  }
}

/**
 * Determines if two messages are duplicates based on content similarity
 * @param {Object} msg1 - First message
 * @param {Object} msg2 - Second message
 * @returns {boolean} True if messages are duplicates
 */
function isDuplicateMessage(msg1, msg2) {
  if (!msg1 || !msg2 || msg1.role !== msg2.role) return false;
  
  try {
    if (msg1.content.length !== msg2.content.length) return false;
    for (let i = 0; i < msg1.content.length; i++) {
      const block1 = msg1.content[i];
      const block2 = msg2.content[i];
      if (block1.type !== block2.type) return false;
      if (block1.type === 'code' && block1.language !== block2.language) return false;
      const similarity = stringSimilarity(block1.data, block2.data);
      if (similarity < 0.9) return false;
    }
    return true;
  } catch (error) {
    logger.error('Error checking for duplicate messages:', error);
    return false;
  }
}

/**
 * Calculates similarity between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score
 */
function stringSimilarity(str1, str2) {
  if (str1 === str2) return 1.0;
  if (!str1 || !str2) return 0.0;
  
  try {
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  } catch (error) {
    logger.error('Error calculating string similarity:', error);
    return 0;
  }
}

/**
 * Main function to scrape DeepSeek conversation with enhanced capabilities
 * @param {Object} options - Configuration options
 * @returns {Object} Conversation data
 */
async function scrapeDeepseek(options = {}) {
  Object.assign(CONFIG, options);
  
  // Wait for dynamic content to load
  if (CONFIG.dynamicLoadDelay) {
    await new Promise(resolve => setTimeout(resolve, CONFIG.dynamicLoadDelay));
  }
  
  const conversationId = generateConversationId();
  let conversationTitle = '';
  
  try {
    const titleElement = document.querySelector(CONFIG.selectors.conversationTitle);
    conversationTitle = titleElement?.textContent.trim() || document.title || "Untitled Conversation";
  } catch (error) {
    logger.warn('Error finding conversation title:', error);
    conversationTitle = document.title || "Untitled Conversation";
  }
  
  const metadata = CONFIG.includeMetadata ? extractMetadata() : null;
  const conversation = {
    conversation_id: conversationId,
    conversation_title: conversationTitle,
    scraper_version: "2.1.0", // Updated version
    messages: [],
    timestamp: new Date().toISOString()
  };
  
  if (metadata) {
    conversation.metadata = metadata;
    conversation.theme = detectTheme();
  }
  
  try {
    const messageContainers = safeQuerySelectorAll(CONFIG.selectors.messageContainers);
    
    if (messageContainers.length === 0) {
      logger.warn('No message containers found. Trying alternate detection method...');
      const possibleContainers = document.querySelectorAll('div > div > div > div');
      for (const container of possibleContainers) {
        const hasUserContent = container.querySelector('[class*="user"], textarea');
        const hasAssistantContent = container.querySelector('[class*="assistant"], .ds-markdown');
        if (hasUserContent || hasAssistantContent) {
          messageContainers.push(container);
        }
      }
      if (messageContainers.length === 0) {
        logger.error('Failed to find message containers using alternate method.');
        conversation.error = 'No message containers found';
        return conversation;
      }
    }
    
    const processedMessages = [];
    messageContainers.forEach((container, index) => {
      let role = 'unknown';
      
      // Enhanced role detection
      if (container.classList.contains('user') || 
          container.querySelector('[class*="user"]') || 
          container.querySelector(CONFIG.selectors.userContent) ||
          index % 2 === 0) {
        role = 'user';
      } else if (container.classList.contains('assistant') || 
                container.querySelector('[class*="assistant"]') || 
                container.querySelector('.ds-markdown') || 
                index % 2 === 1) {
        role = 'assistant';
      }
      
      if (role === 'unknown') {
        logger.warn('Skipping message with unknown role:', container);
        return;
      }
      
      let contentElement;
      if (role === 'user') {
        contentElement = container.querySelector(CONFIG.selectors.userContent) || container;
      } else {
        contentElement = container.querySelector(CONFIG.selectors.assistantContent) || container;
      }
      
      if (!contentElement) {
        logger.warn(`No content element found for ${role} message:`, container);
        return;
      }
      
      let timestamp = null;
      const timeElement = container.querySelector('[class*="time"], time');
      if (timeElement) {
        timestamp = timeElement.getAttribute('datetime') || timeElement.textContent.trim();
      }
      
      const markdownContent = domToMarkdown(contentElement);
      const contentBlocks = parseContent(markdownContent);
      
      if (contentBlocks.length > 0) {
        const message = {
          role,
          create_time: Date.now(),
          content: contentBlocks,
          timestamp: timestamp || new Date().toISOString()
        };
        
        const totalLength = contentBlocks.reduce((sum, block) => 
          sum + (block.data ? block.data.length : 0), 0);
        message.metadata = {
          totalLength,
          blockCount: contentBlocks.length,
          hasCode: contentBlocks.some(block => block.type === 'code'),
          hasMath: contentBlocks.some(block => block.type === 'math')
        };
        
        const isDuplicate = processedMessages.some(msg => isDuplicateMessage(msg, message));
        if (!isDuplicate) {
          processedMessages.push(message);
        } else {
          logger.debug('Skipping duplicate message:', message);
        }
      }
    });
    
    conversation.messages = processedMessages;
    conversation.stats = {
      messageCount: processedMessages.length,
      userMessages: processedMessages.filter(m => m.role === 'user').length,
      assistantMessages: processedMessages.filter(m => m.role === 'assistant').length,
      totalLength: processedMessages.reduce((sum, message) => 
        sum + message.metadata.totalLength, 0)
    };
    
    logger.info(`Successfully scraped conversation with ${conversation.stats.messageCount} messages`);
    return conversation;
  } catch (error) {
    logger.error('Error scraping DeepSeek:', error);
    return { 
      error: 'Failed to scrape DeepSeek conversation',
      errorDetails: error.message,
      conversation_id: conversationId,
      conversation_title: conversationTitle
    };
  }
}

// Additional utility methods for the scraper
const DeepseekScraper = {
  scrape: scrapeDeepseek,
  exportAsJSON: exportConversation,
  exportAsMarkdown: (conversation) => {
    const markdown = formatAsMarkdown(conversation);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.conversation_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  },
  configure: (options) => {
    Object.assign(CONFIG, options);
    return CONFIG;
  },
  detectDOM: () => {
    const detectedConfig = { selectors: {} };
    const possibleMessageContainers = [
      '.f72b0bab',
      '.message-container',
      '[class*="message-container"]',
      '[class*="chat-message"]',
      '[class*="chat"]'
    ];
    for (const selector of possibleMessageContainers) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 1) {
        detectedConfig.selectors.messageContainers = selector;
        break;
      }
    }
    return detectedConfig;
  }
};

// Attach to global window object
window.scrapeDeepseek = scrapeDeepseek;
window.DeepseekScraper = DeepseekScraper;

// Support CommonJS and ES modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { scrapeDeepseek, DeepseekScraper };
}

// Return the scraper for immediate use
scrapeDeepseek;