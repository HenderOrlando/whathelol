/**
 * Item.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        region: {
            model: 'region'
        },
        championrecommendedblockitems: {
            collection: 'championrecommendedblockitem',
            via: 'item'
        },
        frametimelineeventafters:{
            collection: 'frametimelineevent',
            via: 'itemafter'
        },
        frametimelineeventbefores:{
            collection: 'frametimelineevent',
            via: 'itembefore'
        },
        frametimelineevents:{
            collection: 'frametimelineevent',
            via: 'item'
        },
        participants:{
            collection: 'participant',
            via: 'items',
            dominant: true
        },
        colloq: {
            type: 'string'
        },
        consumeOnFull: {
            type: 'boolean'
        },
        consumed: {
            type: 'boolean'
        },
        depth: {
            type: 'integer'
        },
        description: {
            type: 'string'
        },
        // Effect es Map de string
        effect: {
            type: 'string'
        },
        // From es Array de string
        from: {
            type: 'string'
        },
        // ===== gold ===== //
        /*gold: {
            type: 'string'
        },*/
        base: {
            type: 'integer'
        },
        purchasable: {
            type: 'boolean'
        },
        sell: {
            type: 'integer'
        },
        total: {
            type: 'integer'
        },
        // ===== gold ===== //
        group: {
            type: 'string'
        },
        hideFromAll: {
            type: 'boolean'
        },
        itemId: {
            type: 'string'
        },
        image: {
            model: 'image'
        },
        inStore: {
            type: 'boolean'
        },
        // into es Array de string
        into: {
            type: 'string'
        },
        maps: {
            collection: 'map',
            via: 'items'
        },
        name: {
            type: 'string'
        },
        plaintext: {
            type: 'string'
        },
        requiredChampion: {
            type: 'string'
        },
        // ===== RUNE ===== //
        /*rune: {
            type: 'string'
        },*/
        isRune: {
            type: 'boolean'
        },
        tier: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        // ===== RUNE ===== //
        sanitizedDescription: {
            type: 'string'
        },
        specialRecipe: {
            type: 'integer'
        },
        stacks: {
            type: 'integer'
        },
        // ===== STATS ===== //
        /*stats: {
            type: 'string'
        },*/
        FlatArmorMod: {
            type: 'float'
        },
        FlatAttackSpeedMod: {
            type: 'float'
        },
        FlatBlockMod: {
            type: 'float'
        },
        FlatCritChanceMod: {
            type: 'float'
        },
        FlatCritDamageMod: {
            type: 'float'
        },
        FlatEXPBonus: {
            type: 'float'
        },
        FlatEnergyPoolMod: {
            type: 'float'
        },
        FlatEnergyRegenMod: {
            type: 'float'
        },
        FlatHPPoolMod: {
            type: 'float'
        },
        FlatHPRegenMod: {
            type: 'float'
        },
        FlatMPPoolMod: {
            type: 'float'
        },
        FlatMPRegenMod: {
            type: 'float'
        },
        FlatMagicDamageMod: {
            type: 'float'
        },
        FlatMovementSpeedMod: {
            type: 'float'
        },
        FlatPhysicalDamageMod: {
            type: 'float'
        },
        FlatSpellBlockMod: {
            type: 'float'
        },
        PercentArmorMod: {
            type: 'float'
        },
        PercentAttackSpeedMod: {
            type: 'float'
        },
        PercentBlockMod: {
            type: 'float'
        },
        PercentCritChanceMod: {
            type: 'float'
        },
        PercentCritDamageMod: {
            type: 'float'
        },
        PercentDodgeMod: {
            type: 'float'
        },
        PercentEXPBonus: {
            type: 'float'
        },
        PercentHPPoolMod: {
            type: 'float'
        },
        PercentHPRegenMod: {
            type: 'float'
        },
        PercentLifeStealMod: {
            type: 'float'
        },
        PercentMPPoolMod: {
            type: 'float'
        },
        PercentMPRegenMod: {
            type: 'float'
        },
        PercentMagicDamageMod: {
            type: 'float'
        },
        PercentMovementSpeedMod: {
            type: 'float'
        },
        PercentPhysicalDamageMod: {
            type: 'float'
        },
        PercentSpellBlockMod: {
            type: 'float'
        },
        PercentSpellVampMod: {
            type: 'float'
        },
        rFlatArmorModPerLevel: {
            type: 'float'
        },
        rFlatArmorPenetrationMod: {
            type: 'float'
        },
        rFlatArmorPenetrationModPerLevel: {
            type: 'float'
        },
        rFlatCritChanceModPerLevel: {
            type: 'float'
        },
        rFlatCritDamageModPerLevel: {
            type: 'float'
        },
        rFlatDodgeMod: {
            type: 'float'
        },
        rFlatDodgeModPerLevel: {
            type: 'float'
        },
        rFlatEnergyModPerLevel: {
            type: 'float'
        },
        rFlatEnergyRegenModPerLevel: {
            type: 'float'
        },
        rFlatGoldPer10Mod: {
            type: 'float'
        },
        rFlatHPModPerLevel: {
            type: 'float'
        },
        rFlatHPRegenModPerLevel: {
            type: 'float'
        },
        rFlatMPModPerLevel: {
            type: 'float'
        },
        rFlatMPRegenModPerLevel: {
            type: 'float'
        },
        rFlatMagicDamageModPerLevel: {
            type: 'float'
        },
        rFlatMagicPenetrationMod: {
            type: 'float'
        },
        rFlatMagicPenetrationModPerLevel: {
            type: 'float'
        },
        rFlatMovementSpeedModPerLevel: {
            type: 'float'
        },
        rFlatPhysicalDamageModPerLevel: {
            type: 'float'
        },
        rFlatSpellBlockModPerLevel: {
            type: 'float'
        },
        rFlatTimeDeadMod: {
            type: 'float'
        },
        rFlatTimeDeadModPerLevel: {
            type: 'float'
        },
        rPercentArmorPenetrationMod: {
            type: 'float'
        },
        rPercentArmorPenetrationModPerLevel: {
            type: 'float'
        },
        rPercentAttackSpeedModPerLevel: {
            type: 'float'
        },
        rPercentCooldownMod: {
            type: 'float'
        },
        rPercentCooldownModPerLevel: {
            type: 'float'
        },
        rPercentMagicPenetrationMod: {
            type: 'float'
        },
        rPercentMagicPenetrationModPerLevel: {
            type: 'float'
        },
        rPercentMovementSpeedModPerLevel: {
            type: 'float'
        },
        rPercentTimeDeadMod: {
            type: 'float'
        },
        rPercentTimeDeadModPerLevel: {
            type: 'float'
        },
        // ===== STATS ===== //
        tags: {
            model: 'tip'
        }
    }
};

