/**
 * Représente une notification
 */
class Notification {
    /**
     * @param string message Message à envoyer
     * @param string type Si la notification est destinée à une équipe ou à un joueur
     * @param array ids Identifiant de chaque destinataire
     */
    constructor(message, type, ids) {
        this.message = message;
        this.type = type;
        this.ids = ids;
    }
}

module.exports = Notification;
