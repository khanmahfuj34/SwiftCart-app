import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PriceSummary({ subtotal, deliveryFee, discount, total }) {
    return ( <
        View style = { styles.container } >
        <
        View style = { styles.row } >
        <
        Text style = { styles.label } > Subtotal < /Text> <
        Text style = { styles.value } > $ { subtotal ? .toFixed(2) || '0.00' } < /Text> <
        /View> <
        View style = { styles.row } >
        <
        Text style = { styles.label } > Delivery Fee < /Text> <
        Text style = { styles.value } > $ { deliveryFee ? .toFixed(2) || '0.00' } < /Text> <
        /View> {
            discount > 0 && ( <
                View style = { styles.row } >
                <
                Text style = { styles.label } > Discount < /Text> <
                Text style = {
                    [styles.value, styles.discount] } > -$ { discount ? .toFixed(2) } < /Text> <
                /View>
            )
        } <
        View style = {
            [styles.row, styles.rowBorder] } >
        <
        Text style = { styles.totalLabel } > Total < /Text> <
        Text style = { styles.totalValue } > $ { total ? .toFixed(2) || '0.00' } < /Text> <
        /View> <
        /View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginVertical: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    rowBorder: {
        borderTopWidth: 1,
        borderTopColor: '#EDF2F7',
        paddingTop: 12,
        marginTop: 4,
    },
    label: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    discount: {
        color: '#48BB78',
    },
    totalLabel: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '700',
    },
    totalValue: {
        fontSize: 18,
        color: '#1A1A1A',
        fontWeight: '800',
    },
});
color: '#1A1A1A',
    fontWeight: '700',
},
totalValue: {
fontSize: 18,
color: '#1A1A1A',
fontWeight: '800',
},
});