        document.addEventListener('DOMContentLoaded', function() {
            // Initialize dashboard functionality
            
            // Add Transport Group Button
            document.getElementById('addTransportGroupBtn')?.addEventListener('click', function() {
                alert('Add Transport Group functionality would open a modal form here.');
                // This would typically open a modal for adding a new transport group
            });
            
            // Group item click handlers
            document.querySelectorAll('.group-item').forEach(item => {
                item.addEventListener('click', function() {
                    // Remove active class from all items
                    document.querySelectorAll('.group-item').forEach(i => {
                        i.classList.remove('active');
                    });
                    // Add active class to clicked item
                    this.classList.add('active');
                    
                    // Get group ID from data attribute or text
                    const groupTitle = this.querySelector('.group-title').textContent;
                    console.log('Selected group:', groupTitle);
                    // Here you would typically load group details or navigate to group page
                });
            });
            
            // Refresh schedule button
            const refreshSchedule = () => {
                const scheduleTable = document.querySelector('.route-schedule tbody');
                // Simulate refreshing data
                scheduleTable.innerHTML = `
                    <tr>
                        <td>Route 1 - Market</td>
                        <td>06:00 AM</td>
                        <td><span class="schedule-status status-on-time">On Time</span></td>
                        <td>Juan Dela Cruz</td>
                    </tr>
                    <tr>
                        <td>Route 2 - School</td>
                        <td>06:35 AM</td>
                        <td><span class="schedule-status status-delayed">Delayed 20min</span></td>
                        <td>Maria Santos</td>
                    </tr>
                    <tr>
                        <td>Route 3 - Terminal</td>
                        <td>07:00 AM</td>
                        <td><span class="schedule-status status-on-time">On Time</span></td>
                        <td>Pedro Reyes</td>
                    </tr>
                    <tr>
                        <td>Route 4 - Hospital</td>
                        <td>08:00 AM</td>
                        <td><span class="schedule-status status-on-time">Rescheduled</span></td>
                        <td>Ana Martinez</td>
                    </tr>
                `;
                
                // Show notification
                showNotification('Schedule refreshed', 'success');
            };
            
            // Quick action button handlers
            document.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const actionText = this.querySelector('.action-text').textContent;
                    showNotification(`${actionText} form would open here`, 'info');
                });
            });
            
            // Map control handlers
            document.querySelectorAll('.map-controls .btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const action = this.textContent.trim();
                    showNotification(`${action} functionality would be implemented here`, 'info');
                });
            });
            
            // Helper function to show notifications
            function showNotification(message, type = 'info') {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `alert alert-${type}`;
                notification.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 9999;
                    min-width: 300px;
                    animation: slideIn 0.3s ease;
                `;
                notification.innerHTML = `
                    <strong>${type.toUpperCase()}:</strong> ${message}
                    <button class="alert-close" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
                `;
                
                document.body.appendChild(notification);
                
                // Add close button functionality
                notification.querySelector('.alert-close').addEventListener('click', () => {
                    notification.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                });
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.animation = 'slideOut 0.3s ease';
                        setTimeout(() => notification.remove(), 300);
                    }
                }, 5000);
                
                // Add CSS animations
                if (!document.getElementById('notification-styles')) {
                    const style = document.createElement('style');
                    style.id = 'notification-styles';
                    style.textContent = `
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                        @keyframes slideOut {
                            from { transform: translateX(0); opacity: 1; }
                            to { transform: translateX(100%); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
            
            // Initialize dashboard with some sample data
            console.log('Public Transport Coordination Dashboard initialized');
        });